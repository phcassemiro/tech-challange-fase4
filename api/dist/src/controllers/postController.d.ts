import { Request, Response, NextFunction } from 'express';
declare class PostController {
    /**
     * @swagger
     * /posts/busca:
     *   get:
     *     summary: Lista posts filtrados por título ou descrição
     *     tags:
     *       - Posts
     *     description: Retorna uma lista de posts que atendem aos filtros de título ou descrição.
     *     parameters:
     *       - name: titulo
     *         in: query
     *         description: Filtro pelo título do post
     *         required: false
     *         schema:
     *           type: string
     *       - name: descricao
     *         in: query
     *         description: Filtro pela descrição do post
     *         required: false
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Lista de posts encontrados
     *       500:
     *         description: Erro interno do servidor
     */
    static listarPostPorFiltro(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /posts:
     *   get:
     *     summary: Lista os posts Ativos
     *     tags:
     *       - Posts
     *     description: Retorna apenas os posts ativos.
     *     responses:
     *       200:
     *         description: Lista dos posts ativos
     *       500:
     *         description: Erro interno do servidor
     */
    static listarPosts(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /posts/professor:
     *   get:
     *     summary: Lista todos os posts
     *     tags:
     *       - Posts
     *     description: Retorna todos os posts já criados, inclusive os inativos.
     *     responses:
     *       200:
     *         description: Lista de todos os posts
     *       500:
     *         description: Erro interno do servidor
     */
    static listarPostsProfessor(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    /**
     * @swagger
     * /posts/{id}:
     *   get:
     *     summary: Retorna um post específico pelo ID
     *     tags:
     *       - Posts
     *     description: Retorna os dados de um post específico com base no ID fornecido.
     *     parameters:
     *       - name: id
     *         in: path
     *         description: ID do post
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Post encontrado
     *       404:
     *         description: Post não encontrado
     */
    static listarPostPorId(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * @swagger
     * /posts:
     *   post:
     *     summary: Cria um novo post
     *     tags:
     *       - Posts
     *     description: Cria um novo post, sem permitir a alteração de datas de criação ou atualização.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               titulo:
     *                 type: string
     *               descricao:
     *                 type: string
     *               autor:
     *                 type: string
     *     responses:
     *       201:
     *         description: Post criado com sucesso
     *       500:
     *         description: Erro interno ao criar o post
     */
    static cadastrarPost(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * @swagger
     * /posts/{id}:
     *   put:
     *     summary: Atualiza um post específico
     *     tags:
     *       - Posts
     *     description: Atualiza um post existente, sem permitir a alteração das datas de criação ou atualização.
     *     parameters:
     *       - name: id
     *         in: path
     *         description: ID do post
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               titulo:
     *                 type: string
     *               descricao:
     *                 type: string
     *               conteudo:
     *                 type: string
     *     responses:
     *       200:
     *         description: Post atualizado com sucesso
     *       500:
     *         description: Erro ao atualizar o post
     */
    static atualizarPost(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * @swagger
     * /posts/{id}:
     *   delete:
     *     summary: Exclui um post específico
     *     tags:
     *       - Posts
     *     description: Exclui um post com base no ID fornecido.
     *     parameters:
     *       - name: id
     *         in: path
     *         description: ID do post
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Post excluído com sucesso
     *       500:
     *         description: Erro ao excluir o post
     */
    static excluirPost(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default PostController;
//# sourceMappingURL=postController.d.ts.map