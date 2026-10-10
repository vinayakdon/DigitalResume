import type { ProjectCategory } from "./types";

/** CSS colour variable for each category (defined in globals.css, light and dark). */
export const categoryColor: Record<ProjectCategory, string> = {
  "AI & NLP": "var(--cat-ai)",
  "Machine Learning": "var(--cat-ml)",
  "Data Analytics & BI": "var(--cat-bi)",
  "Data Engineering & Automation": "var(--cat-de)",
  "Software Engineering": "var(--cat-sw)",
};
