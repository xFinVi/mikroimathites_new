import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { structure } from "./sanity/plugins/structure";
import schemas from "./sanity/schemas";

// For client-side Studio, use NEXT_PUBLIC_ prefixed vars
// Fallback to server-side vars for backwards compatibility
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  "2024-03-01";

if (!projectId) {
  throw new Error(
    "Missing Sanity Project ID. Please set NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID in your .env.local file"
  );
}

if (!dataset) {
  throw new Error(
    "Missing Sanity Dataset. Please set NEXT_PUBLIC_SANITY_DATASET or SANITY_DATASET in your .env.local file"
  );
}

export default defineConfig({
  name: "mikroi-mathites",
  title: "Mikroi Mathites Studio",
  projectId,
  dataset,
  apiVersion,
  basePath: "/studio",
  plugins: [deskTool({ structure })],
  schema: {
    types: schemas,
  },
});

