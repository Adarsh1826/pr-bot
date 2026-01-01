import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";

import {Webhooks} from '@octokit/webhooks'
import fetchPatch from "./utils/utils.js";
import { Octokit } from "@octokit/rest";
import { aiReview } from "./utils/aiReview.js";
import {postReview} from "./utils/postReview.js"
import { githubapp } from "./auth/auth.js";



const app = fastify()
const port = parseInt(process.env.PORT!)


// webhook

const webhooks = new Webhooks({ secret: process.env.WEBHOOK_SECRET! });
webhooks.on("pull_request", async ({ payload }) => {
  if (payload.action === "opened") {
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const prNumber = payload.pull_request.number;
    const installationId = payload.installation?.id;
     const octokit = await githubapp.getInstallationOctokit(installationId!);
    const patches = await fetchPatch({
      owner,
      repo,
      prNumber,
      octokit
    });

    
    const reviewText = await aiReview(patches);

   
    await postReview({
      owner,
      repo,
      prNumber,
      reviewText,
      
      octokit
    });
  }
});



// health check endpoint
app.get("/health",(req,res)=>{
    res.send({
        "status":"running"
    })
})


//webhook endpoint
app.post("/webhook", async (req, reply) => {
  try {
    const payload =
      Buffer.isBuffer(req.body)
        ? req.body.toString("utf8")
        : JSON.stringify(req.body);
        reply.send({ ok: true });
    await webhooks.verifyAndReceive({
      id: req.headers["x-github-delivery"] as string,
      name: req.headers["x-github-event"] as string,
      payload,
      signature: req.headers["x-hub-signature-256"] as string,
    });

    
  } catch (err) {
    console.error("Webhook error:", err);
    reply.code(401).send({ error: "Invalid webhook" });
  }
});



// server listening 
app.listen({ port: port, host: "0.0.0.0" },async()=>{
    console.log(`server is listening on http://localhost:${port}`);
   
});


