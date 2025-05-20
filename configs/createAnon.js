import User from "../src/user/user.model.js"
import { hash } from 'argon2';

export const createAnoni = async() =>{
    try{
        const anonExistente = await User.findOne({ name: "anonimo" });

        if (anonExistente) {
            console.log("Ya existe un anonimo en la base de datos.");
            return;
        }

        const encryptedPassword = await hash ("12345678");

        const anonData = {
            name: "Anonimo",
            username: "anonimo",
            email: "anonimo@example.com",
            password: encryptedPassword,
            role: "USER_ROLE"
        };
        const newAnon = new User(anonData);
        await newAnon.save();

        console.log("anonimo por defecto creado exitosamente.");
    }catch(err){
        console.error("Error al crear el anonimo por defecto:", err.message);
    }
}