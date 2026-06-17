# Bookshelf API

Node.js + TypeScript REST API backed by PostgreSQL.

## Setup

```bash
cp .env.example .env        # fill in your DB credentials
npm install
npm run dev                 # development (ts-node-dev)
npm run build && npm start  # production
```

## Endpoints

| Method | Path         | Description     |
|--------|--------------|-----------------|
| GET    | /books       | List all books  |
| GET    | /books/:id   | Get one book    |
| POST   | /books       | Add a book      |
| PATCH  | /books/:id   | Update a book   |
| DELETE | /books/:id   | Delete a book   |

## Example — Add a Book

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "image": "https://covers.openlibrary.org/b/id/8575708-L.jpg",
    "description": "A dystopian novel set in a totalitarian society.",
    "genre": "Fiction",
    "price": 12.99,
    "rating": 4.9,
    "pages": 328,
    "language": "English",
    "publisher": "Secker & Warburg",
    "publishedYear": 1949,
    "isbn": "9780451524935"
  }'
```

## Example — Update a Book

```bash
curl -X PATCH http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{ "price": 39.99, "rating": 4.9 }'
```

## Example — Delete a Book

```bash
curl -X DELETE http://localhost:3000/books/1
```
