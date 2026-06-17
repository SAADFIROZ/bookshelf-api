import { Router, Request, Response } from "express";
import { BookRepository } from "../db/bookRepository";
import { validateCreateBook, validateUpdateBook } from "../middleware/validate";

export const booksRouter = Router();

// GET /books
booksRouter.get("/", async (_req, res: Response) => {
  try {
    const books = await BookRepository.findAll();
    res.json({ count: books.length, data: books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// GET /books/:id
booksRouter.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "id must be a number" }); return; }
  try {
    const book = await BookRepository.findById(id);
    if (!book) { res.status(404).json({ error: `Book ${id} not found` }); return; }
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// POST /books  — Add Book
booksRouter.post("/", validateCreateBook, async (req: Request, res: Response) => {
  try {
    const book = await BookRepository.create({
      title:         req.body.title,
      author:        req.body.author,
      image:         req.body.image,
      description:   req.body.description,
      genre:         req.body.genre,
      price:         Number(req.body.price),
      rating:        Number(req.body.rating),
      pages:         Number(req.body.pages),
      language:      req.body.language,
      publisher:     req.body.publisher,
      publishedYear: Number(req.body.publishedYear),
      isbn:          req.body.isbn,
    });
    res.status(201).json(book);
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "23505") {
      res.status(409).json({ error: "ISBN already exists" }); return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create book" });
  }
});

// PATCH /books/:id  — Update Book
booksRouter.patch("/:id", validateUpdateBook, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "id must be a number" }); return; }
  try {
    const updated = await BookRepository.update(id, req.body);
    if (!updated) { res.status(404).json({ error: `Book ${id} not found` }); return; }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update book" });
  }
});

// DELETE /books/:id  — Delete Book
booksRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "id must be a number" }); return; }
  try {
    const deleted = await BookRepository.delete(id);
    if (!deleted) { res.status(404).json({ error: `Book ${id} not found` }); return; }
    res.json({ message: `Book ${id} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete book" });
  }
});
