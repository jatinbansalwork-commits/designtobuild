import type { DetailItem } from "@/lib/details-data";
import { GRID_DETAILS, KALASH_DETAIL } from "@/lib/details-data";

export function getDesignOfTheDay(): DetailItem {
  return KALASH_DETAIL;
}

export function getGridProjects(): DetailItem[] {
  return GRID_DETAILS;
}
