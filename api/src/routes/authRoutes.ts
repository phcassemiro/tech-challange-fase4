import express, { Router } from "express";
import AuthController from "../controllers/authController";

const routes: Router = express.Router();

routes.post("/auth/registrar", AuthController.registrar);
routes.post("/auth/login", AuthController.login);

export default routes;