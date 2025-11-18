import { PostModel } from "../models/postModel.js";
class PostController {
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
    static async listarPostPorFiltro(req, res, next) {
        try {
            const { titulo, descricao } = req.query;
            const busca = {};
            if (titulo)
                busca.titulo = { $regex: titulo, $options: "i" };
            if (descricao)
                busca.descricao = { $regex: descricao, $options: "i" };
            const postsResultado = await PostModel.find(busca);
            const postsDatasFormatadas = postsResultado.map((post) => {
                const postObj = post.toObject();
                postObj.dataCriacao = postObj.dataCriacao.toLocaleDateString("pt-BR");
                postObj.dataAtualizacao = postObj.dataAtualizacao.toLocaleDateString("pt-BR");
                return postObj;
            });
            return res.status(200).json(postsDatasFormatadas);
        }
        catch (error) {
            next(error);
        }
    }
    ;
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
    static async listarPosts(req, res, next) {
        '';
        try {
            const listaPostsAtivos = await PostModel.find({ postAtivo: true });
            const postsFormatados = listaPostsAtivos.map((post) => {
                const postObj = post.toObject();
                postObj.dataCriacao = post.dataCriacao.toLocaleDateString("pt-BR");
                postObj.dataAtualizacao = post.dataAtualizacao.toLocaleDateString("pt-BR");
                return postObj;
            });
            return res.status(200).json(postsFormatados);
        }
        catch (error) {
            return next(error);
        }
    }
    ;
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
    static async listarPostsProfessor(req, res, next) {
        try {
            const listaPosts = await PostModel.find({});
            const postsFormatados = listaPosts.map((post) => {
                const postObj = post.toObject();
                postObj.dataCriacao = post.dataCriacao.toLocaleDateString("pt-BR");
                postObj.dataAtualizacao = post.dataAtualizacao.toLocaleDateString("pt-BR");
                return postObj;
            });
            return res.status(200).json(postsFormatados);
        }
        catch (error) {
            return next(error);
        }
    }
    ;
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
    static async listarPostPorId(req, res, next) {
        try {
            const id = req.params.id;
            const postEncontrado = await PostModel.findById(id);
            if (postEncontrado !== null) {
                const postObj = postEncontrado.toObject();
                if (postEncontrado.dataCriacao instanceof Date) {
                    postObj.dataCriacao = postEncontrado.dataCriacao.toLocaleDateString("pt-BR");
                }
                if (postEncontrado.dataAtualizacao instanceof Date) {
                    postObj.dataAtualizacao = postEncontrado.dataAtualizacao.toLocaleDateString("pt-BR");
                }
                res.status(200).json(postObj);
            }
            else {
                res.status(404).json({ message: 'Id do post não localizado' });
            }
        }
        catch (error) {
            return next(error);
        }
    }
    ;
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
    static async cadastrarPost(req, res, next) {
        try {
            if (req.body.dataAtualizacao || req.body.dataCriacao) {
                res.status(500).json({ message: "Não é permitido enviar datas" });
            }
            else {
                const novoPost = await PostModel.create(req.body);
                res.status(201).json({ message: "Post criado com sucesso", post: novoPost });
            }
        }
        catch (error) {
            return next(error);
        }
    }
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
    static async atualizarPost(req, res, next) {
        try {
            if (req.body.dataAtualizacao || req.body.dataCriacao) {
                res.status(500).json({ message: "Não é permitido alterar datas" });
            }
            else {
                const id = req.params.id;
                await PostModel.findByIdAndUpdate(id, req.body);
                res.status(200).json({ message: "Post atualizado" });
            }
        }
        catch (error) {
            return next(error);
        }
    }
    ;
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
    static async excluirPost(req, res, next) {
        try {
            const id = req.params.id;
            await PostModel.findByIdAndDelete(id);
            res.status(200).json({ message: "Post excluído" });
        }
        catch (error) {
            return next(error);
        }
    }
    ;
}
export default PostController;
//# sourceMappingURL=postController.js.map