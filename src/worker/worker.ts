import { Worker } from "bullmq";

import { connection } from "../utils/connection.js";
import { githubapp } from "../auth/auth.js";
import fetchPatch from "../utils/utils.js";
import { aiReview } from "../utils/aiReview.js";
import { postReview } from "../utils/postReview.js";

const worker1 = new Worker(
    "pr-review",
    async (job) => {
        const { owner, repo, prNumber, installationId } = job.data

        const octokit = await githubapp.getInstallationOctokit(installationId)

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





    },{
        connection:connection,
        concurrency:2
    }
    
)

