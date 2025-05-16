<<<<<<< HEAD
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
=======
import {Schema, model} from "mongoose";

const PublicacionSchema = Schema({
    categori:{type:String,required:true},
    user:{type:Schema.Types.ObjectId, ref:'user',required:true},
    titulo:{type:String,required:true},
    textoprincipal: {type:String,required:true},
    commit: [{ type: Schema.Types.ObjectId, ref: 'Commit' }],
    status:{ type: Boolean, default:true}
},
{
    timestamps:true,
    versionkey:false
});

    export default model('Publicacion', PublicacionSchema);
>>>>>>> 3a5537f2f0acc8beddc5e011761d2b78cfe9151f
