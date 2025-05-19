import { Schema, model } from "mongoose";
 
const categoriaSchema = Schema ({
    name:{type: String,required: [true, "El nombre de la categoria es necesaria"],maxLength: [20, "La categoria no puede pasar los 20 caracteres"]},
    status:{type: Boolean,default: true},
})
 
export default model("Categoria", categoriaSchema)