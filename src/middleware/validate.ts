import { Request, Response, NextFunction } from "express";

/** Validates fields required for creating a new book */
export function validateCreateBook(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const required = [
    "title", "author", "image", "description", "genre",
    "price", "rating", "pages", "language",
    "publisher", "publishedYear", "isbn",
  ];

  const missing = required.filter(
    (f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === ""
  );

  if (missing.length > 0) {
    res.status(400).json({
      error: "Validation failed",
      missing,
    });
    return;
  }

  const numericChecks: Array<{ field: string; min: number; max?: number }> = [
    { field: "price",  min: 0 },
    { field: "rating", min: 0, max: 5 },
    { field: "pages",  min: 1 },
    { field: "publishedYear", min: 1000, max: new Date().getFullYear() },
  ];

  for (const { field, min, max } of numericChecks) {
    const val = Number(req.body[field]);
    if (isNaN(val) || val < min || (max !== undefined && val > max)) {
      res.status(400).json({
        error: `Invalid value for '${field}'`,
        hint: max !== undefined ? `Must be between ${min} and ${max}` : `Must be ≥ ${min}`,
      });
      return;
    }
  }

  next();
}

/** Validates that at least one field is provided for an update */
export function validateUpdateBook(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ error: "Request body must contain at least one field to update" });
    return;
  }
  next();
}
