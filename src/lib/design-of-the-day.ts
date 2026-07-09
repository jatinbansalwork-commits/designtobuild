import type { DetailItem } from "@/lib/details-data";
import { GRID_DETAILS } from "@/lib/details-data";

/** Featured hero card — always the first entry in the portfolio grid. */
export function getDesignOfTheDay(): DetailItem {
  return GRID_DETAILS[0];
}

export function getGridProjects(): DetailItem[] {
  return GRID_DETAILS;
}
