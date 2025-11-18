import express from "express";
import AuthController from "../controllers/authController";
const routes = express.Router();
routes.post("/auth/registrar", AuthController.registrar);
routes.post("/auth/login", AuthController.login);
export default routes;
//# sourceMappingURL=authRoutes.js.map