"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/postRoutes.ts
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("../controllers/postController"));
const routes = express_1.default.Router();
routes.get("/posts", postController_1.default.listarPosts); // Lista de posts ativos
routes.get("/posts/professor", postController_1.default.listarPostsProfessor); // Lista de posts para professor
routes.get("/posts/busca", postController_1.default.listarPostPorFiltro); // Lista de post por query string
routes.get("/posts/:id", postController_1.default.listarPostPorId); // Lista de post por ID
routes.post("/posts", postController_1.default.cadastrarPost); // Criação de postagem
routes.put("/posts/:id", postController_1.default.atualizarPost); // Edição de postagem
routes.delete("/posts/:id", postController_1.default.excluirPost); // Exclusão de postagem
exports.default = routes;
//# sourceMappingURL=postRoutes.js.map