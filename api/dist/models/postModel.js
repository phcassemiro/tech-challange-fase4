"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = exports.PostModel = void 0;
// src/models/postModel.ts
const mongoose_1 = __importStar(require("mongoose"));
const comentarioSchema = new mongoose_1.Schema({
    usuario: { type: String, required: true },
    texto: { type: String, required: true },
    data: { type: Date, default: Date.now }
}, {
    timestamps: true
});
const postSchema = new mongoose_1.Schema({
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
exports.postSchema = postSchema;
const PostModel = mongoose_1.default.model("posts", postSchema);
exports.PostModel = PostModel;
//# sourceMappingURL=postModel.js.map