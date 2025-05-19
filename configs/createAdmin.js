import User from "../src/user/user.model.js"
import { hash } from 'argon2';

export const createAdmin = async() =>{
    try{
        const adminExistente = await User.findOne({ role: "ADMIN_ROLE" });

        if (adminExistente) {
            console.log("Ya existe un administrador en la base de datos.");
            return;
        }

        const encryptedPassword = await hash ("12345678");

        const adminData = {
            name: "Admin",
            username: "admin",
            email: "admin@example.com",
            password: encryptedPassword,
            role: "ADMIN_ROLE"
        };
        const newAdmin = new User(adminData);
        await newAdmin.save();

        console.log("Administrador por defecto creado exitosamente.");
    }catch(err){
        console.error("Error al crear el administrador por defecto:", err.message);
    }
}