import fastify from "fastify";
import dotenv from 'dotenv'
import {Webhooks} from '@octokit/webhooks'
dotenv.configDotenv()
const app = fastify()
const port = parseInt(process.env.PORT!)

// webhook

const webhooks = new Webhooks({ secret: process.env.WEBHOOK_SECRET! });

webhooks.on("pull_request",({payload})=>{
    console.log(payload);
    
})

// health check endpoint
app.get("/test",(req,res)=>{
    res.send({
        "status":"running"
    })
})


//webhook endpoint

app.post('/webhook', async (req, reply) => {
  try {
    // await webhooks.receive({
    //   id: req.headers["x-github-delivery"] as string,
    //   name: req.headers["x-github-event"] as string,
    //   payload: req.body,
    //   signature: req.headers["x-hub-signature-256"] as string,
    // });

    reply.code(200).send({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    reply.code(500).send({ error: "Webhook processing failed" });
  }
});


// server listening 
app.listen({port:port },()=>{
    console.log(`server is listening on http://localhost:${port}`);
    
})