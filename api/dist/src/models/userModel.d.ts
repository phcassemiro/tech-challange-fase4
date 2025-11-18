import mongoose, { Document } from 'mongoose';
export interface IUsuario extends Document {
    nome: string;
    email: string;
    senha: string;
    cargo?: string;
}
declare const Usuario: mongoose.Model<IUsuario, {}, {}, {}, mongoose.Document<unknown, {}, IUsuario, {}> & IUsuario & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Usuario;
//# sourceMappingURL=userModel.d.ts.map