import { pool } from "./pool";
import { Book, CreateBookDTO, UpdateBookDTO } from "../types/book";

function rowToBook(row: Record<string, unknown>): Book {
  return {
    id:            row.id as number,
    title:         row.title as string,
    author:        row.author as string,
    image:         row.image as string,
    description:   row.description as string,
    genre:         row.genre as string,
    price:         parseFloat(row.price as string),
    rating:        parseFloat(row.rating as string),
    pages:         row.pages as number,
    language:      row.language as string,
    publisher:     row.publisher as string,
    publishedYear: row.published_year as number,
    isbn:          row.isbn as string,
  };
}

export const BookRepository = {
  async findAll(): Promise<Book[]> {
    const { rows } = await pool.query("SELECT * FROM books ORDER BY id ASC");
    return rows.length ? rows.map(rowToBook): [];
  },

  async findById(id: number): Promise<Book | null> {
    const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
    return rows[0] ? rowToBook(rows[0]) : null;
  },

  async create(dto: CreateBookDTO): Promise<Book> {
    const { rows } = await pool.query(
      `INSERT INTO books (title, author, image, description, genre, price, rating, pages, language, publisher, published_year, isbn)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [dto.title, dto.author, dto.image, dto.description, dto.genre,
       dto.price, dto.rating, dto.pages, dto.language, dto.publisher,
       dto.publishedYear, dto.isbn]
    );
    return rowToBook(rows[0]);
  },

  async update(id: number, dto: UpdateBookDTO): Promise<Book | null> {
    const fieldMap: Record<string, string> = {
      title: "title", author: "author", image: "image",
      description: "description", genre: "genre", price: "price",
      rating: "rating", pages: "pages", language: "language",
      publisher: "publisher", publishedYear: "published_year", isbn: "isbn",
    };
    const keys = Object.keys(dto);
    if (keys.length === 0) return this.findById(id);

    const setClauses = keys.map((k, i) => `${fieldMap[k]} = $${i + 1}`);
    const values = [...keys.map((k) => (dto as Record<string, unknown>)[k]), id];

    const { rows } = await pool.query(
      `UPDATE books SET ${setClauses.join(", ")}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );
    return rows[0] ? rowToBook(rows[0]) : null;
  },

  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query("DELETE FROM books WHERE id = $1", [id]);
    return (rowCount ?? 0) > 0;
  },
};
