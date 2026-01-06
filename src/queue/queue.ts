import { Queue } from "bullmq";
import { connection } from "../utils/connection.js";


export const reviewQueue = new Queue("pr-review",{
  connection
})