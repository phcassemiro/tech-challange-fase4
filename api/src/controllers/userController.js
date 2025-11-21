import { usuario } from "../models/userModel.js";

class UserController {

  // Lista todos os usuários (menos a senha)
  static async listarUsuarios(req, res, next) {
    try {
      const lista = await usuario.find().select("-senha");
      res.status(200).json(lista);
    } catch (error) {
      next(error);
    }
  }

  // Altera o cargo de um usuário
  static async alterarCargo(req, res, next) {
    try {
      const { id } = req.params;
      const { novoCargo } = req.body; // "professor" ou "aluno"

      // Validação simples
      if (!["professor", "aluno", "admin"].includes(novoCargo)) {
        return res.status(400).json({ message: "Cargo inválido." });
      }

      const usuarioAtualizado = await usuario.findByIdAndUpdate(
        id,
        { cargo: novoCargo },
        { new: true }
      ).select("-senha");

      if (!usuarioAtualizado) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      res.status(200).json({ message: "Cargo atualizado!", usuario: usuarioAtualizado });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;