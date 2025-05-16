import Publicacion from '../publicaciones/publicacion.model.js';
import Commit from '../commit/commit.model.js';
import User from '../user/user.model.js';
import jwt from 'jsonwebtoken';

export const agregarCommit = async (req, res) => {
    try {
        const { textoprincipal, username, titulo } = req.body;

        const lowerUsername = username ? username.toLowerCase() : null;
        const lowerPublicacion = titulo ? titulo.toLowerCase() : null;

        const publicacion = await Publicacion.findOne({ titulo: lowerPublicacion });
        if (!publicacion) {
            return res.status(404).json({
                success: false,
                message: "La publicación no existe"
            });
        }

        const user = await User.findOne({ username: lowerUsername });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

       const nuevoCommit = new Commit({
            textoprincipal,
            user: user._id,  
            publicacion: publicacion._id,  
            status: true 
        });
        const commitGuardado = await nuevoCommit.save();

        await Publicacion.findByIdAndUpdate(publicacion._id, {
            $push: { commit: commitGuardado._id }
        });

        const publicacionActualizada = await Publicacion.findById(publicacion._id).populate({
            path: "commit",
            select: "textoprincipal",
            populate: {
                path: "user",
                select: "username"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Commit agregado correctamente",
            publicacionConCommit: {
                usuario: user.username,
                titulo: publicacionActualizada.titulo,
                texto: publicacionActualizada.textoprincipal,
                commits: publicacionActualizada.commit
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error al agregar el commit",
            error: err.message
        });
    }
};


export const editarCommit = async (req, res) => {
    try {
        const { id } = req.params; 
        const token = req.header("x-token");
        const { textoprincipal } = req.body; 

        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "No hay token en la petición"
            });
        }

        let uid;
        try {
            const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
            uid = decoded.uid;
        } catch (err) {
            return res.status(401).json({
                success: false,
                msg: "Token inválido o expirado"
            });
        }


        const commit = await Commit.findById(id);
        if (!commit) {
            return res.status(404).json({
                success: false,
                msg: "Commit no encontrado"
            });
        }

        if (commit.user.toString() !== uid) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permiso para editar este commit"
            });
        }

        commit.textoprincipal = textoprincipal;
        const commitActualizado = await commit.save();

        return res.status(200).json({
            success: true,
            msg: "Commit editado con éxito",
            commit: commitActualizado
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            msg: "Error al intentar actualizar el commit",
            error: err.message
        });
    }
};



export const eliminarCommit = async (req, res) => {
    try {
        const { id } = req.params; 
        const token = req.header("x-token");

        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "No hay token en la petición"
            });
        }

        let uid;
        try {
            const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
            uid = decoded.uid;
        } catch (err) {
            return res.status(401).json({
                success: false,
                msg: "Token inválido o expirado"
            });
        }

        const commit = await Commit.findById(id);
        if (!commit) {
            return res.status(404).json({
                success: false,
                msg: "El commit no existe"
            });
        }

        if (commit.user.toString() !== uid) {
            return res.status(401).json({
                success: false,
                msg: "No tienes acceso para eliminar este commit"
            });
        }

        const publicacion = await Publicacion.findOne({ commit: id });
        if (publicacion) {
            publicacion.commit = publicacion.commit.filter(
                (commitId) => commitId.toString() !== id.toString()
            );
            await publicacion.save(); 
        }

        await Commit.findByIdAndUpdate(id, { status: false });

        return res.status(200).json({
            success: true,
            msg: "Commit eliminado con éxito"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar el commit",
            error: err.message
        });
    }
};
