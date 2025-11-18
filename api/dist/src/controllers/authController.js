import Usuario from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
class AuthController {
    /**
     * @swagger
     * /auth/registrar:
     *   post:
     *     summary: Registra um novo usuário
     *     tags:
     *       - Autenticação
     *     description: Cria uma nova conta de usuário no sistema.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nome:
     *                 type: string
     *               email:
     *                 type: string
     *               senha:
     *                 type: string
     *               cargo:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuário criado com sucesso
     *       400:
     *         description: Erro na requisição
     *       500:
     *         description: Erro interno do servidor
     */
    static async registrar(req, res, next) {
        try {
            const { nome, email, senha, cargo } = req.body;
            if (!nome || !email || !senha || !cargo) {
                return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
            }
            const usuarioExistente = await Usuario.findOne({ email });
            if (usuarioExistente) {
                return res.status(400).json({ mensagem: "E-mail já cadastrado." });
            }
            const senhaHash = await bcrypt.hash(senha, 10);
            const novoUsuario = await Usuario.create({ nome, email, senha: senhaHash, cargo });
            res.status(201).json({ mensagem: "Usuário criado com sucesso!", Usuario: novoUsuario });
        }
        catch (error) {
            return next(error);
        }
    }
    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Realiza login
     *     tags:
     *       - Autenticação
     *     description: Retorna um token JWT se as credenciais forem válidas.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               senha:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login realizado com sucesso
     *       401:
     *         description: Credenciais inválidas
     *       500:
     *         description: Erro interno do servidor
     */
    static async login(req, res, next) {
        try {
            const { email, senha } = req.body;
            const usuarioEncontrado = await Usuario.findOne({ email }).select('+cargo');
            if (!usuarioEncontrado) {
                return res.status(401).json({ mensagem: "Credenciais inválidas." });
            }
            const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);
            if (!senhaValida) {
                return res.status(401).json({ mensagem: "Credenciais inválidas." });
            }
            const token = jwt.sign({ id: usuarioEncontrado._id, email: usuarioEncontrado.email }, process.env.JWT_SECRET || "segredo", { expiresIn: "1h" });
            res.status(200).json({
                mensagem: "Login realizado com sucesso",
                token,
                nome: usuarioEncontrado.nome,
                cargo: usuarioEncontrado.cargo
            });
        }
        catch (error) {
            return next(error);
        }
    }
}
export default AuthController;
//# sourceMappingURL=authController.js.map