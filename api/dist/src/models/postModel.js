// src/models/postModel.ts
import mongoose, { Schema } from "mongoose";
const comentarioSchema = new Schema({
    usuario: { type: String, required: true },
    texto: { type: String, required: true },
    data: { type: Date, default: Date.now }
}, {
    timestamps: true
});
const postSchema = new Schema({
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
}, {
    versionKey: false,
    timestamps: { createdAt: "dataCriacao", updatedAt: "dataAtualizacao" }
});
const PostModel = mongoose.model("posts", postSchema);
export { PostModel, postSchema };
//# sourceMappingURL=postModel.js.map