// src/routes/postRoutes.ts
import express, { Router } from "express";
import PostController from "../controllers/postController";

const routes: Router = express.Router();

routes.get("/posts", PostController.listarPosts); // Lista de posts ativos
routes.get("/posts/professor", PostController.listarPostsProfessor); // Lista de posts para professor
routes.get("/posts/busca", PostController.listarPostPorFiltro); // Lista de post por query string
routes.get("/posts/:id", PostController.listarPostPorId); // Lista de post por ID
routes.post("/posts", PostController.cadastrarPost); // Criação de postagem
routes.put("/posts/:id", PostController.atualizarPost); // Edição de postagem
routes.delete("/posts/:id", PostController.excluirPost); // Exclusão de postagem

export default routes;