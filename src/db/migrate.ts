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

export async function migrate(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(CREATE_TABLE);
    await client.query("COMMIT");
    console.log("DB migration complete");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
