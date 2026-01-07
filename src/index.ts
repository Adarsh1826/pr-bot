import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";

import { Webhooks } from "@octokit/webhooks";
import fetchPatch from "./utils/utils.js";
import { aiReview } from "./utils/aiReview.js";
import { postReview } from "./utils/postReview.js";
import { githubapp } from "./auth/auth.js";
import { startPRReviewWorker } from "./worker/worker.js";
import { reviewQueue } from "./queue/queue.js";
import { log } from "console";

const app = fastify();
const port = parseInt(process.env.PORT!);

// Initialize webhook
const webhooks = new Webhooks({ secret: process.env.WEBHOOK_SECRET! });

// Log every pull_request event
webhooks.on("pull_request", async ({ payload }) => {
  console.log("Webhook received for pull_request event");

  // Log basic info
  console.log("Repository:", payload.repository.full_name);
  console.log("PR Number:", payload.pull_request?.number);
  console.log("Action:", payload.action);
 // console.log("Installation ID:", payload.installation?.id);

  if (payload.action === "opened" || payload.action=="reopened") {
    try {
      const owner = payload.repository.owner.login;
      const repo = payload.repository.name;
      const prNumber = payload.pull_request.number;
      const installationId = payload.installation?.id;

      if (!installationId) {
        console.error("Installation ID missing in payload. Cannot proceed.");
        return;
      }


      await reviewQueue.add(
        "pr-review",{
          owner,
          repo,
          prNumber,
          installationId
        },{
           jobId: `${owner}/${repo}#${prNumber}`,
          removeOnComplete:true,
          removeOnFail:false
        }
      )

      // Create Octokit instance for this repo installation
      console.log("job queued sucess")
    } catch (err) {
      console.error("Error handling pull_request event:", err);
    }
  } else {
    console.log("Pull request action not handled:", payload.action);
  }
});

// Health check
app.get("/health", (req, res) => {
  console.log("/health endpoint hit");
  res.send({ status: "running" });
});

// Webhook endpoint
app.post("/webhook", async (req, reply) => {
  try {
    const payload = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : JSON.stringify(req.body);

    console.log("/webhook endpoint hit");

    await webhooks.verifyAndReceive({
      id: req.headers["x-github-delivery"] as string,
      name: req.headers["x-github-event"] as string,
      payload,
      signature: req.headers["x-hub-signature-256"] as string,
    });

    reply.send({ ok: true });
  } catch (err) {
    console.error("Webhook verification error:", err);
    reply.code(401).send({ error: "Invalid webhook" });
  }
});


startPRReviewWorker()

// Server listening
app.listen({ port: port, host: "0.0.0.0" }, async () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
