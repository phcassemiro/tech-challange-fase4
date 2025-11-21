import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {

        userid: {type: mongoose.Schema.Types.ObjectId},
        nome:   { type: String, required: true },
        email:  { type: String, required: true, unique: true },
        senha:  { type: String, required: true },
        cargo:  { type: String, enum: ["aluno", "professor"]}
    },

    {
        versionKey: false,
        timestamps: { createdAt: 'dataCriacaoUsuario'}

    }

);

const usuario = mongoose.model("usuario", userSchema);

export {usuario, userSchema};
