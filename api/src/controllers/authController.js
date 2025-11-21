import { usuario } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  static async registrar(req, res, next) {
    try {      
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
      }

      const usuarioExistente = await usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado." });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await usuario.create({
        nome,
        email,
        senha: senhaHash,
        cargo: "aluno", 
      });

      res.status(201).json({
        mensagem: "Usuário criado com sucesso!",
        usuario: novoUsuario,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, senha } = req.body;

      const usuarioEncontrado = await usuario.findOne({ email }).select("+cargo +senha");
      if (!usuarioEncontrado) {
        return res.status(401).json({ mensagem: "Credenciais inválidas." });
      }

      const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha);
      if (!senhaValida) {
        return res.status(401).json({ mensagem: "Credenciais inválidas." });
      }
      
      const cargoNormalizado = usuarioEncontrado.cargo ? usuarioEncontrado.cargo.toLowerCase() : "aluno";

      const token = jwt.sign(
        {
          id: usuarioEncontrado._id,
          email: usuarioEncontrado.email,
          cargo: cargoNormalizado,
        },
        process.env.JWT_SECRET || "segredo",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        mensagem: "Login realizado com sucesso",
        token,
        nome: usuarioEncontrado.nome,
        cargo: cargoNormalizado,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;