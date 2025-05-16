import User from "../src/user/user.model.js";
import Categori from "../src/categori/categori.model.js";
import Publicacion from "../src/publicacion/publicacion.model.js";

export const createPublicaciones = async () => {
    try {
        const admin = await User.findOne({ username: "admin" });
        if (!admin) {
            console.log(" Usuario admin no encontrado. Crea el usuario primero.");
            return;
        }

        const categoriasConTareas = [
            {
                name: "practicasupervisada",
                publicaciones: [
                    { titulo: "Informe de avance", textoprincipal: "Entrega del informe parcial de la práctica." },
                    { titulo: "Presentación final", textoprincipal: "Exposición oral del proyecto final ante tutores." }
                ]
            },
            {
                name: "taller",
                publicaciones: [
                    { titulo: "Taller de React", textoprincipal: "Práctica intensiva en desarrollo con ReactJS." },
                    { titulo: "Taller de MongoDB", textoprincipal: "Introducción y consulta de bases de datos no relacionales." }
                ]
            },
            {
                name: "tecnologia",
                publicaciones: [
                    { titulo: "Novedades en inteligencia artificial", textoprincipal: "Resumen de avances recientes en IA." },
                    { titulo: "Tendencias de desarrollo web", textoprincipal: "Exploración de herramientas modernas como Vite y TailwindCSS." }
                ]
            }
        ];

        for (const cat of categoriasConTareas) {
            const categoria = await Categori.findOne({ name: cat.name });
            if (!categoria) {
                console.log(` Categoría '${cat.name}' no encontrada. Omisión de sus publicaciones.`);
                continue;
            }

            for (const pub of cat.publicaciones) {
                const nueva = new Publicacion({
                    titulo: pub.titulo,
                    textoprincipal: pub.textoprincipal,
                    categori: categoria._id,
                    user: admin._id,
                    status: true
                });

                await nueva.save();
                console.log(` Publicación '${pub.titulo}' creada en la categoría '${cat.name}'.`);
            }
        }

        console.log("Publicaciones generadas automáticamente con éxito.");

    } catch (err) {
        console.error("Error al crear publicaciones automáticas:", err.message);
    }
};
