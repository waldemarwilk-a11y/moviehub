// pages/api/movies/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import pool from "../../../lib/db";

type SessionUser = {
  id: string;
  role: string;
  email?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getServerSession(req, res, authOptions)) as { user: SessionUser } | null;

  if (!session?.user) {
    return res.status(401).json({ error: "Nie jesteś zalogowany" });
  }

  // 🔹 GET – lista filmów (dostępne dla każdego zalogowanego)
  if (req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT * FROM movies ORDER BY created_at DESC"
      );
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
  }

  // 🔹 POST – dodawanie filmu (TYLKO ADMIN)
  if (req.method === "POST") {
    if (session.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Nie masz uprawnień" });
    }

    const { title, description, year, genre } = req.body;

    if (!title || !description || !year || !genre) {
      return res.status(400).json({ error: "Brak danych" });
    }

    // ✅ OWASP: walidacja długości pól
    if (title.length > 100)
      return res.status(400).json({ error: "Tytuł jest za długi (max 100 znaków)" });
    if (description.length > 1000)
      return res.status(400).json({ error: "Opis jest za długi (max 1000 znaków)" });
    if (genre.length > 50)
      return res.status(400).json({ error: "Gatunek jest za długi (max 50 znaków)" });
    if (year < 1800 || year > new Date().getFullYear() + 1)
      return res.status(400).json({ error: "Niepoprawny rok filmu" });

    try {
      const result = await pool.query(
        `INSERT INTO movies (title, description, year, genre, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING *`,
        [title, description, year, genre]
      );

      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Błąd serwera" });
    }
  }

  return res.status(405).json({ error: "Metoda niedozwolona" });
}
