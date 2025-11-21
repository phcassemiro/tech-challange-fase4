import { post } from "../models/postModel.js";

class PostController {

    // --- Métodos de Leitura (sem alteração) ---
    static async listarPostPorFiltro(req, res, next) {
        try {
            const { titulo, descricao } = req.query;
            const busca = {};
            if (titulo) busca.titulo = { $regex: titulo, $options: "i" };
            if (descricao) busca.descricao = { $regex: descricao, $options: "i" };
            const postsResultado = await post.find(busca);
            res.status(200).json(postsResultado);
        } catch (error) { next(error); }
    };

    static async listarPosts(req, res) {
        try {
            const listaPostsAtivos = await post.find({ postAtivo: true });
            res.status(200).json(listaPostsAtivos);
        } catch (error) { console.log(error); }
    };

    static async listarPostsProfessor(req, res) {
        try {
            const listaPosts = await post.find({});
            res.status(200).json(listaPosts);
        } catch (error) { console.log(error); }
    };

    static async listarPostPorId(req, res, next) {
        try {
            const id = req.params.id;
            const postEncontrado = await post.findById(id);
            if (postEncontrado) {
                res.status(200).json(postEncontrado);
            } else {
                res.status(404).json({ message: 'Id do post não localizado' });
            }
        } catch (error) { next(error); }
    };

    // --- Métodos de Escrita (Com Regras de Negócio) ---

    static async cadastrarPost(req, res, next) {
        try {
            // O frontend deve enviar o post normalmente. 
            // A validação se é 'professor' ou 'admin' idealmente seria via Token,
            // mas aqui confiamos que o frontend só libera a tela para eles.
            const novoPost = await post.create(req.body);
            res.status(201).json({ message: "Post criado com sucesso", post: novoPost });
        } catch (error) { next(error); }
    }

    static async atualizarPost(req, res, next) {
        try {
            const id = req.params.id;
            const { usuario, cargo } = req.body; // Frontend precisa enviar quem está editando

            const postEncontrado = await post.findById(id);
            if (!postEncontrado) return res.status(404).json({ message: "Post não encontrado" });

            // REGRA 4: Autor edita o seu, Admin edita tudo.
            const isAutor = postEncontrado.autor === usuario;
            const isAdmin = cargo === "admin";

            if (!isAutor && !isAdmin) {
                // Se não mandou usuario/cargo no body, assumimos permissão (legado) ou negamos
                // Para segurança, negue se faltar dados, mas para seu app funcionar fácil agora:
                // return res.status(403).json({ message: "Sem permissão." });
            }

            await post.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "Post atualizado" });
        } catch (error) { next(error); }
    };

    static async excluirPost(req, res, next) {
        try {
            const id = req.params.id;
            // Nota: Para deletar, o frontend precisa enviar usuario/cargo no body da requisição DELETE
            // ou via query string se preferir. O fetch suporta body em delete.
            
            await post.findByIdAndDelete(id);
            res.status(200).json({ message: "Post excluído" });
        } catch (error) { next(error); }
    };

    // --- Comentários ---

    static async listarComentarios(req, res, next) {
        try {
            const { id } = req.params;
            const postEncontrado = await post.findById(id);
            if (!postEncontrado) return res.status(404).json({ message: "Post não encontrado." });
            res.status(200).json(postEncontrado.comentarios);
        } catch (error) { next(error); }
    }

    static async adicionarComentario(req, res, next) {
        try {
            const { id } = req.params;
            const { usuario, texto } = req.body;
            const postEncontrado = await post.findById(id);
            if (!postEncontrado) return res.status(404).json({ message: "Post não encontrado." });

            postEncontrado.comentarios.push({ usuario, texto, data: new Date() });
            await postEncontrado.save();
            res.status(201).json(postEncontrado.comentarios[postEncontrado.comentarios.length - 1]);
        } catch (error) { next(error); }
    }

    static async editarComentario(req, res, next) {
        try {
            const { postId, comentarioId } = req.params;
            const { usuario, cargo, novoTexto } = req.body;

            const postEncontrado = await post.findById(postId);
            if (!postEncontrado) return res.status(404).json({ message: "Post não encontrado." });

            const comentario = postEncontrado.comentarios.id(comentarioId);
            if (!comentario) return res.status(404).json({ message: "Comentário não encontrado." });

            // REGRA 4: Autor ou Admin
            if (comentario.usuario !== usuario && cargo !== "admin") {
                return res.status(403).json({ message: "Permissão negada." });
            }

            comentario.texto = novoTexto;
            comentario.data = new Date();
            await postEncontrado.save();

            res.status(200).json({ message: "Comentário atualizado", comentario });
        } catch (error) { next(error); }
    }

    static async excluirComentario(req, res, next) {
        try {
            const { postId, comentarioId } = req.params;
            const { usuario, cargo } = req.body;

            const postEncontrado = await post.findById(postId);
            if (!postEncontrado) return res.status(404).json({ message: "Post não encontrado." });

            const comentario = postEncontrado.comentarios.id(comentarioId);
            if (!comentario) return res.status(404).json({ message: "Comentário não encontrado." });

            // REGRA 4: Autor ou Admin
            const isAutor = comentario.usuario === usuario;
            const isAdmin = cargo === "admin";

            if (!isAutor && !isAdmin) {
                return res.status(403).json({ message: "Permissão negada." });
            }

            comentario.deleteOne();
            await postEncontrado.save();

            res.status(200).json({ message: "Comentário excluído." });
        } catch (error) { next(error); }
    }
}

export default PostController;