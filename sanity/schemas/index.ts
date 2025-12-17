import { article } from "./documents/article";
import { activity } from "./documents/activity";
import { printable } from "./documents/printable";
import { category } from "./documents/category";
import { ageGroup } from "./documents/ageGroup";
import { qaItem } from "./documents/qaItem";
import { seo } from "./objects/seo";

const schemas = [article, activity, printable, category, ageGroup, qaItem, seo];

export default schemas;
import { category } from "./documents/category";
import { seo } from "./objects/seo";

// Register all schema types here
const schemas = [category, seo];

export default schemas;

