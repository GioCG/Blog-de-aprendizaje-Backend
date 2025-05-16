import { Schema, model } from "mongoose";

const PublicacionSchema = new Schema({
    categori: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    titulo: { type: String, required: true },
    textoprincipal: { type: String, required: true },
    commit: [{ type: Schema.Types.ObjectId, ref: 'Commit' }],
    status: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Publicacion', PublicacionSchema);
