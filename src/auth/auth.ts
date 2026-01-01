import 'dotenv/config';  
import { App } from "@octokit/app";

const appId = process.env.APP_ID;
const privateKey = process.env.PRIVATE_KEY;

if (!appId || !privateKey) {
  throw new Error("Missing GitHub App credentials in .env");
}

export const githubapp = new App({
  appId: Number(appId),
  privateKey: privateKey.replace(/\\n/g, "\n"),
});
