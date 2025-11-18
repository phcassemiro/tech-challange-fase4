// src/models/userModel.ts
import mongoose, { Schema } from 'mongoose';
const usuarioSchema = new Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true, select: false },
    cargo: { type: String }
});
const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
//# sourceMappingURL=userModel.js.map