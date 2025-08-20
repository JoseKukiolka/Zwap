// authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  // El formato esperado es: "Bearer token"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  try {
    // 🔑 Verificamos el token usando el mismo secret que en loginUsuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos la info del usuario decodificada para usarla en las rutas
    req.user = decoded; // podés usar req.user.id o req.user.CorreoElectronico

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
