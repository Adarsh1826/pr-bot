import fastify from "fastify";
import dotenv from 'dotenv'
import {Webhooks} from '@octokit/webhooks'
import fetchPatch from "./utils/utils";
import { aiReview,postReview } from "./utils/utils";
import { Octokit } from "@octokit/rest";
dotenv.configDotenv()
const app = fastify()
const port = parseInt(process.env.PORT!)

// webhook

const webhooks = new Webhooks({ secret: process.env.WEBHOOK_SECRET! });
webhooks.on("pull_request", async ({ payload }) => {
  if (payload.action === "opened") {
    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;
    const prNumber = payload.pull_request.number;

    const patches = await fetchPatch({
      owner,
      repo,
      prNumber,
    });

    
    const reviewText = await aiReview(patches);

   
    await postReview({
      owner,
      repo,
      prNumber,
      reviewText,
    });
  }
});



// health check endpoint
app.get("/test",(req,res)=>{
    res.send({
        "status":"running"
    })
})


//webhook endpoint
app.post("/webhook", async (req, reply) => {
  try {
    await webhooks.verifyAndReceive({
      id: req.headers["x-github-delivery"] as string,
      name: req.headers["x-github-event"] as string,
      payload: req.body as string,
      signature: req.headers["x-hub-signature-256"] as string,
    });

    reply.send({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    reply.code(401).send({ error: "Invalid webhook" });
  }
});



// server listening 
app.listen({port:port },async()=>{
    console.log(`server is listening on http://localhost:${port}`);
    const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const me = await octokit.users.getAuthenticated();
console.log("Authenticated as:", me.data.login);
    
})