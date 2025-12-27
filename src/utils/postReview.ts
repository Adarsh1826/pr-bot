import { Octokit } from "@octokit/rest";
import { PostReviewTypes } from "../types/index.js";

export async function postReview({
  owner,
  repo,
  prNumber,
  reviewText,
}: PostReviewTypes) {
  if (!owner || !repo || !prNumber || !reviewText) {
    throw new Error("postReview: Missing required parameters");
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      body: reviewText,
      event: "COMMENT", // Non-blocking review
    });

    console.log(`✅ AI review posted on PR #${prNumber}`);
  } catch (error) {
    console.error("❌ Failed to post PR review:", error);

    // Fallback: post as normal PR comment
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: reviewText,
    });

    console.log(`⚠️ Posted review as PR comment instead`);
  }
}
