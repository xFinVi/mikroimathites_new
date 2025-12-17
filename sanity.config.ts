import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import schemas from "./sanity/schemas";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || "2024-03-01";

export default defineConfig({
  name: "mikroi-mathites",
  title: "Mikroi Mathites Studio",
  projectId: projectId || "",
  dataset: dataset || "production",
  apiVersion,
  basePath: "/studio",
  plugins: [deskTool()],
  schema: {
    types: schemas,
  },
});

