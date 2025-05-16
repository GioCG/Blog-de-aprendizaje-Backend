import mongoose from "mongoose";

const publicacionSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    textoprincipal: { type: String, required: true },
    categori: { type: mongoose.Schema.Types.ObjectId, ref: "Categori", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: Boolean, default: true }
}, {
    timestamps: true
});

export default mongoose.model("Publicacion", publicacionSchema);
