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
