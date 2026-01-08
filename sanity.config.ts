import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { structure } from "./sanity/plugins/structure";
import schemas from "./sanity/schemas";
import { assertSanityPublic } from "./lib/sanity/config.public";
import { qaPublishActions } from "./sanity/plugins/qa-publish-action";

/**
 * Sanity Studio Configuration
 * Studio needs valid config, so we validate here
 */

const config = assertSanityPublic();

export default defineConfig({
  name: "mikroi-mathites",
  title: "Mikroi Mathites Studio",
  projectId: config.projectId,
  dataset: config.dataset,
  apiVersion: config.apiVersion,
  basePath: "/studio",
  plugins: [deskTool({ structure })],
  schema: {
    types: schemas,
  },
  document: {
    actions: qaPublishActions,
  },
});
