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
