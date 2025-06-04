const express = require ("express");
const app = express ();
const dotenv = require ("dotenv").config();
const cors = require ("cors");

app.use(cors());
app.use(express.json());

app.listen(3001, console.log("Server Running"))

https://www.youtube.com/watch?v=XKwOsn37KCc 5