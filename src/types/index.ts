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
};