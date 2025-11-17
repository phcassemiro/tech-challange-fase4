import mongoose, { Document } from "mongoose";
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
declare const postSchema: mongoose.Schema<IPost, mongoose.Model<IPost, any, any, any, mongoose.Document<unknown, any, IPost, any> & IPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IPost, mongoose.Document<unknown, {}, mongoose.FlatRecord<IPost>, {}> & mongoose.FlatRecord<IPost> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
declare const PostModel: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost, {}> & IPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export { PostModel, postSchema, IPost, IComentario };
//# sourceMappingURL=postModel.d.ts.map