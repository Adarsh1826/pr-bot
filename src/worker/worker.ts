import { Worker } from "bullmq";

import { connection } from "../utils/connection.js";
import { githubapp } from "../auth/auth.js";
import fetchPatch from "../utils/utils.js";
import { aiReview } from "../utils/aiReview.js";
import { postReview } from "../utils/postReview.js";



export function startPRReviewWorker() {
  const worker = new Worker(
    "pr-review",
    async (job) => {
      try {
        const { owner, repo, prNumber, installationId } = job.data;

        console.log("Job received:", job.data);

        const octokit = await githubapp.getInstallationOctokit(
          installationId
        );

        const patches = await fetchPatch({
          owner,
          repo,
          prNumber,
          octokit,
        });

        console.log("Patches fetched successfully");

        const reviewText = await aiReview(patches);

        await postReview({
          owner,
          repo,
          prNumber,
          reviewText,
          octokit,
        });

        console.log(`Review posted for PR #${prNumber}`);
      } catch (err) {
        console.error("Worker failed:", err);
        throw err; // important so BullMQ marks job as failed
      }
    },
    {
      connection,
      concurrency: 2,
    }
  )};

// worker1.on("active",()=>{
//      console.log("wokere started");
//         console.log(reviewQueue.getActiveCount())
//     console.log("Wokere is working");
    
// })

// worker1.on("error",(error)=>{
//     console.log(error);
    
// })