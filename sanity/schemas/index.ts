import { article } from "./documents/article";
import { activity } from "./documents/activity";
import { printable } from "./documents/printable";
import { category } from "./documents/category";
import { ageGroup } from "./documents/ageGroup";
import { qaItem } from "./documents/qaItem";
import { recipe } from "./documents/recipe";
import { tag } from "./documents/tag";
import { author } from "./documents/author";
import { curatedCollection } from "./documents/curatedCollection";
import { pageSettings } from "./documents/pageSettings";
import { homeHero } from "./documents/homeHero";
import { featuredContentSection } from "./documents/featuredContentSection";
import { forParentsSection } from "./documents/forParentsSection";
import { activitiesPrintablesSection } from "./documents/activitiesPrintablesSection";
import { sponsor } from "./documents/sponsor";
import { seo } from "./objects/seo";
import { hero } from "./objects/hero";
import { ingredient } from "./objects/ingredient";
import { featuredBanner } from "./objects/featuredBanner";
import { activityStep } from "./objects/activity-step";

// Register all schema types here
const schemas = [
  // Documents
  article,
  activity,
  printable,
  recipe,
  category,
  ageGroup,
  tag,
  author,
  curatedCollection,
  pageSettings,
  qaItem,
  homeHero,
  featuredContentSection,
  forParentsSection,
  activitiesPrintablesSection,
  sponsor,
  // Objects
  seo,
  hero,
  ingredient,
  featuredBanner,
  activityStep,
];

export default schemas;

