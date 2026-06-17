import { pool } from "./pool";

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS books (
    id             SERIAL PRIMARY KEY,
    title          VARCHAR(255)  NOT NULL,
    author         VARCHAR(255)  NOT NULL,
    image          TEXT          NOT NULL DEFAULT '',
    description    TEXT          NOT NULL DEFAULT '',
    genre          VARCHAR(100)  NOT NULL,
    price          NUMERIC(8,2)  NOT NULL CHECK (price >= 0),
    rating         NUMERIC(3,1)  NOT NULL CHECK (rating BETWEEN 0 AND 5),
    pages          INTEGER       NOT NULL CHECK (pages > 0),
    language       VARCHAR(50)   NOT NULL DEFAULT 'English',
    publisher      VARCHAR(255)  NOT NULL,
    published_year INTEGER       NOT NULL,
    isbn           VARCHAR(20)   NOT NULL UNIQUE,
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  );
`;

const SEED = `
  INSERT INTO books (title, author, image, description, genre, price, rating, pages, language, publisher, published_year, isbn)
  VALUES
    ('The Pragmatic Programmer', 'David Thomas & Andrew Hunt', 'https://covers.openlibrary.org/b/id/8091016-L.jpg', 'A guide to pragmatic thinking and software craftsmanship.', 'Technology', 49.99, 4.8, 352, 'English', 'Addison-Wesley', 2019, '9780135957059'),
    ('Clean Code', 'Robert C. Martin', 'https://covers.openlibrary.org/b/id/8221138-L.jpg', 'A handbook of agile software craftsmanship.', 'Technology', 44.99, 4.7, 431, 'English', 'Prentice Hall', 2008, '9780132350884'),
    ('Design Patterns', 'Gang of Four', 'https://covers.openlibrary.org/b/id/8239943-L.jpg', 'Elements of reusable object-oriented software.', 'Technology', 54.99, 4.6, 395, 'English', 'Addison-Wesley', 1994, '9780201633610'),
    ('The Lean Startup', 'Eric Ries', 'https://covers.openlibrary.org/b/id/7886163-L.jpg', 'How entrepreneurs use continuous innovation to build successful businesses.', 'Business', 29.99, 4.5, 299, 'English', 'Crown Business', 2011, '9780307887894'),
    ('Dune', 'Frank Herbert', 'https://covers.openlibrary.org/b/id/8353964-L.jpg', 'A science fiction epic set on the desert planet Arrakis.', 'Science Fiction', 19.99, 4.9, 688, 'English', 'Chilton Books', 1965, '9780441013593'),
    ('Sapiens', 'Yuval Noah Harari', 'https://covers.openlibrary.org/b/id/8577536-L.jpg', 'A brief history of humankind.', 'Non-Fiction', 24.99, 4.7, 443, 'English', 'Harper', 2015, '9780062316097'),
    ('Atomic Habits', 'James Clear', 'https://covers.openlibrary.org/b/id/10522466-L.jpg', 'An easy and proven way to build good habits and break bad ones.', 'Self-Help', 22.99, 4.8, 320, 'English', 'Avery', 2018, '9780735211292'),
    ('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 'https://covers.openlibrary.org/b/id/8212674-L.jpg', 'A comedy science fiction series.', 'Science Fiction', 14.99, 4.8, 224, 'English', 'Pan Books', 1979, '9780330258647')
  ON CONFLICT (isbn) DO NOTHING;
`;

export async function migrate(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(CREATE_TABLE);
    await client.query(SEED);
    await client.query("COMMIT");
    console.log("✅ DB migration complete");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
