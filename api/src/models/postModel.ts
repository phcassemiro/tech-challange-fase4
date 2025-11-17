// src/models/postModel.ts
import mongoose, { Document, Schema } from "mongoose";

interface IComentario {
  usuario: string;
  texto: string;
  data?: Date;
}

interface IPost extends Document {
  titulo: string;
  descricao: string;
  autor: string;
  postAtivo: boolean;
  comentarios: IComentario[];
  dataCriacao?: Date | string;
  dataAtualizacao?: Date | string;

}

const comentarioSchema = new Schema<IComentario>(
  {
    usuario: { type: String, required: true },
    texto: { type: String, required: true },
    data: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

const postSchema = new Schema<IPost>(
  {
    titulo: {
      type: String,
      required: [true, "O título do post é obrigatório"]
    },
    descricao: {
      type: String,
      required: [true, "A descrição do post é obrigatória"]
    },
    autor: {
      type: String,
      required: [true, "O autor do post é obrigatório"]
    },
    postAtivo: {
      type: Boolean,
      default: true,
      required: [true, "O status do post é obrigatório"]
    },
    comentarios: [comentarioSchema]
  },
  {
    versionKey: false,
    timestamps: { createdAt: "dataCriacao", updatedAt: "dataAtualizacao" }
  }
);

const PostModel = mongoose.model<IPost>("posts", postSchema);

export { PostModel, postSchema, IPost, IComentario };