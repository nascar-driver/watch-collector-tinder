export interface Watch {
  /** Stable unique id (slug) — used for React keys and AnimatePresence. */
  id: string;
  brand: string;
  model: string;
  /** Market value in USD. */
  price: number;
  /**
   * Path to a transparent-background product image under `/public/watches/`.
   * Real assets are dropped in later; until then the card renders a branded
   * placeholder when the image is missing/unavailable.
   */
  image: string;
}
