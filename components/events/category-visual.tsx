/**
 * Back-compat re-exports. Kept as a NON-client module so Server Components can
 * import CATEGORY_ICON without turning it into a client reference.
 *   - CATEGORY_ICON / CATEGORY_HUE  → plain server-safe data (category-meta)
 *   - EventThumb                    → interactive client component (event-thumb)
 */
export { CATEGORY_ICON, CATEGORY_HUE } from "./category-meta";
export { EventThumb } from "./event-thumb";
