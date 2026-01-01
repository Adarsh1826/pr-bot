import type { PullRequestFetchTyes, PatchesTypes } from "../types/index.js";
import type { githubapp } from "../auth/auth.js";

// Make octokit part of the input
interface FetchPatchProps extends PullRequestFetchTyes {
  octokit: Awaited<ReturnType<typeof githubapp.getInstallationOctokit>>;
}

export default async function fetchPatch({
  owner,
  repo,
  prNumber,
  octokit,
}: FetchPatchProps) {
  // Use octokit.request() for GitHub App compatibility
  const { data: files } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner,
      repo,
      pull_number: prNumber,
    }
  );

  const patches: PatchesTypes[] = [];

  for (const file of files) {
    if (file.patch) {
      patches.push({
        filename: file.filename,
        patch: file.patch,
      });
    }
  }

  return patches;
}
