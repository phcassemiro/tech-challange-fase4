"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/postRoutes.test.ts
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const postRoutes_1 = __importDefault(require("./postRoutes"));
// Mock do controller
jest.mock('../controllers/postController', () => ({
    PostController: {
        listarPosts: jest.fn((req, res) => res.status(200).json({ message: 'listarPosts' })),
        listarPostsProfessor: jest.fn((req, res) => res.status(200).json({ message: 'listarPostsProfessor' })),
        listarPostPorFiltro: jest.fn((req, res) => res.status(200).json({ message: 'listarPostPorFiltro' })),
        listarPostPorId: jest.fn((req, res) => res.status(200).json({ message: 'listarPostPorId' })),
        cadastrarPost: jest.fn((req, res) => res.status(201).json({ message: 'cadastrarPost' })),
        atualizarPost: jest.fn((req, res) => res.status(200).json({ message: 'atualizarPost' })),
        excluirPost: jest.fn((req, res) => res.status(204).end()),
    }
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(postRoutes_1.default);
describe('postRoutes', () => {
    it('GET /posts should call listarPosts', async () => {
        const res = await (0, supertest_1.default)(app).get('/posts');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('listarPosts');
    });
    it('GET /posts/professor should call listarPostsProfessor', async () => {
        const res = await (0, supertest_1.default)(app).get('/posts/professor');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('listarPostsProfessor');
    });
    it('GET /posts/busca should call listarPostPorFiltro', async () => {
        const res = await (0, supertest_1.default)(app).get('/posts/busca');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('listarPostPorFiltro');
    });
    it('GET /posts/:id should call listarPostPorId', async () => {
        const res = await (0, supertest_1.default)(app).get('/posts/123');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('listarPostPorId');
    });
    it('POST /posts should call cadastrarPost', async () => {
        const res = await (0, supertest_1.default)(app).post('/posts').send({ title: 'Novo Post' });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('cadastrarPost');
    });
    it('PUT /posts/:id should call atualizarPost', async () => {
        const res = await (0, supertest_1.default)(app).put('/posts/123').send({ title: 'Atualizado' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('atualizarPost');
    });
    it('DELETE /posts/:id should call excluirPost', async () => {
        const res = await (0, supertest_1.default)(app).delete('/posts/123');
        expect(res.status).toBe(204);
    });
});
//# sourceMappingURL=postRoutes.test.js.map