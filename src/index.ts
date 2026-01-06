import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";

import { Webhooks } from "@octokit/webhooks";
import fetchPatch from "./utils/utils.js";
import { aiReview } from "./utils/aiReview.js";
import { postReview } from "./utils/postReview.js";
import { githubapp } from "./auth/auth.js";

import { reviewQueue } from "./queue/queue.js";


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

  if (payload.action === "opened") {
    try {
      const owner = payload.repository.owner.login;
      const repo = payload.repository.name;
      const prNumber = payload.pull_request.number;
      const installationId = payload.installation?.id;

      if (!installationId) {
        console.error("Installation ID missing in payload. Cannot proceed.");
        return;
      }

      // Create Octokit instance for this repo installation
      const octokit = await githubapp.getInstallationOctokit(installationId);
      console.log("Octokit instance created for installation ID", installationId);

      await reviewQueue.add(
        "review-pr",{
          owner,
          repo,
          prNumber,
          installationId
        },{
          jobId: `${payload.repository.full_name}#${prNumber}@${payload.pull_request.head.sha}`,
          attempts: 3,
          removeOnComplete: true,
        }
      )
      console.log("Job queued successfully")
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



// Server listening
app.listen({ port: port, host: "0.0.0.0" }, async () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
