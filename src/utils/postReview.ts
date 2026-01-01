// import { Octokit } from "@octokit/rest";
// import { PostReviewTypes } from "../types/index.js";

// export async function postReview({
//   owner,
//   repo,
//   prNumber,
//   reviewText,
// }: PostReviewTypes) {
//   if (!owner || !repo || !prNumber || !reviewText) {
//     throw new Error("postReview: Missing required parameters");
//   }

//   const octokit = new Octokit({
//     auth: process.env.GITHUB_TOKEN,
//   });

//   try {
//     await octokit.pulls.createReview({
//       owner,
//       repo,
//       pull_number: prNumber,
//       body: reviewText,
//       event: "COMMENT", 
//     });

//     console.log(`✅ AI review posted on PR #${prNumber}`);
//   } catch (error) {
//     console.error("❌ Failed to post PR review:", error);

//     // Fallback: post as normal PR comment
//     await octokit.issues.createComment({
//       owner,
//       repo,
//       issue_number: prNumber,
//       body: reviewText,
//     });

//     console.log(`⚠️ Posted review as PR comment instead`);
//   }
// }


// import type { PostReviewTypes } from "../types/index.js";

// export async function postReview({
//   owner,
//   repo,
//   prNumber,
//   reviewText,
//   octokit, // properly typed now
// }: PostReviewTypes) {
//   if (!owner || !repo || !prNumber || !reviewText) {
//     throw new Error("postReview: Missing required parameters");
//   }

//   try {
//     await octokit.pulls.createReview({
//       owner,
//       repo,
//       pull_number: prNumber,
//       body: reviewText,
//       event: "COMMENT",
//     });

//     console.log(`✅ AI review posted on PR #${prNumber}`);
//   } catch (error) {
//     console.error("❌ Failed to post PR review:", error);

//     // fallback as comment
//     await octokit.issues.createComment({
//       owner,
//       repo,
//       issue_number: prNumber,
//       body: reviewText,
//     });

//     console.log(`⚠️ Posted review as PR comment instead`);
//   }
// }



import type { PostReviewTypes } from "../types/index.js";

export async function postReview({
  owner,
  repo,
  prNumber,
  reviewText,
  octokit,
}: PostReviewTypes) {
  if (!owner || !repo || !prNumber || !reviewText) {
    throw new Error("postReview: Missing required parameters");
  }

  try {
    // Use octokit.request() instead of octokit.rest or octokit.pulls
    await octokit.request("POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
      owner,
      repo,
      pull_number: prNumber,
      body: reviewText,
      event: "COMMENT",
    });

    console.log(`✅ AI review posted on PR #${prNumber}`);
  } catch (error) {
    console.error("❌ Failed to post PR review:", error);

    // fallback: post as issue comment
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
      owner,
      repo,
      issue_number: prNumber,
      body: reviewText,
    });

    console.log(`⚠️ Posted review as PR comment instead`);
  }
}
