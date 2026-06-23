import express, { Request, Response } from "express";
import { connectDB } from "./db/pool";
import { migrate } from "./db/migrate";
import { booksRouter } from "./routes/books";
import { pool } from "./db/pool";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

// Health check
app.get("/healthz", (_req, res) => res.json({ status: "ok" }));
app.get("/readyz", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "not ready" });
  }
});

// Routes
app.use("/books", booksRouter);

app.get("/", (_req: Request, res: Response) => {
  res.json({ service: "Bookshelf API", version: "1.0.0" });
});

async function bootstrap() {
  await connectDB();
  await migrate();
  app.listen(PORT, () => console.log(`Bookshelf API running on port ${PORT}`));
}

bootstrap().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
