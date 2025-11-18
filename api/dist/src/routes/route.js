// src/routes/route.ts
import express from "express";
import authRoutes from "./authRoutes";
import postRoutes from "./postRoutes";
const router = express.Router();
router.use(authRoutes);
router.use(postRoutes);
export default router;
//# sourceMappingURL=route.js.map