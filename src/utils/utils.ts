import { PullRequestFetchTyes ,PatchesTypes,PostReviewTypes } from "../types/index.js";
import { Octokit } from "@octokit/rest";

export default async function fetchPatch({owner,repo,prNumber}:PullRequestFetchTyes) {
    const octokit = new Octokit({
        auth:process.env.GITHUB_TOKEN
    })
    const files = await octokit.pulls.listFiles({
        owner,
        repo, 
        pull_number: prNumber,
    })

    const patches:PatchesTypes[] = [];

    for(let i=0;i<files.data.length;i++){
        const file = files.data[i];
        if(file.patch){
            patches.push({
                filename:file.filename,
                patch:file.patch
            })
        }
    }
    return patches
}

export async function aiReview(patches: PatchesTypes[]) {
  let review = "AI Review\n\n";

  for (let i = 0; i < patches.length; i++) {
    const patch = patches[i];

    review += `File: ${patch.filename}\n`;
    review += `Changes:\n`;
    review += `${patch.patch}\n\n`;
  }

 
  return review;
}


export async function postReview({
  owner,
  repo,
  prNumber,
  reviewText,
}: PostReviewTypes) {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  await octokit.pulls.createReview({
    owner,
    repo,
    pull_number: prNumber,
    body: reviewText,
    event: "COMMENT",
  });
}
