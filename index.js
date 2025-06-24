import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

https://www.youtube.com/watch?v=XKwOsn37KCc 5