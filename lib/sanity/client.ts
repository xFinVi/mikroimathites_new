import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || "2024-03-01";
const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN;

if (!projectId || !dataset) {
  console.warn("Sanity client not configured: missing SANITY_PROJECT_ID or SANITY_DATASET");
}

export const sanityClient =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: true, // set false if you need freshest drafts
        token, // optional; required for drafts/authed reads
      })
    : null;

