export interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  description: string;
  genre: string;
  price: number;
  rating: number;
  pages: number;
  language: string;
  publisher: string;
  publishedYear: number;
  isbn: string;
}

export type CreateBookDTO = Omit<Book, "id">;
export type UpdateBookDTO = Partial<CreateBookDTO>;
