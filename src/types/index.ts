import { githubapp } from "../auth/auth.js";
export interface PullRequestFetchTyes{
    owner:string,
    repo:string,
    prNumber:number
}

export interface PatchesTypes {
    filename:string,
    patch:string
}

export type PostReviewTypes = {
  owner: string;
  repo: string;
  prNumber: number;
  reviewText: string;
  octokit: Awaited<ReturnType<typeof githubapp.getInstallationOctokit>>;
};


export interface FetchPatchProps extends PullRequestFetchTyes {
  octokit: Awaited<ReturnType<typeof githubapp.getInstallationOctokit>>;
}
