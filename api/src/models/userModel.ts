// src/models/userModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario extends Document {
  nome: string;
  email: string;
  senha: string;
  cargo?: string;
}

const usuarioSchema = new Schema<IUsuario>({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true, select: false },
  cargo: { type: String }
});

const Usuario = mongoose.model<IUsuario>('Usuario', usuarioSchema);

export default Usuario;