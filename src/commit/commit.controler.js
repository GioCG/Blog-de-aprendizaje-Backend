import Publicacion from '../publicaciones/publicacion.model.js';
import Commit from '../commit/commit.model.js';
import User from '../user/user.model.js';
import jwt from 'jsonwebtoken';

export const agregarCommit = async (req, res) => {
    try {
        const { textoprincipal, username, titulo, parentCommitId } = req.body;


        const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        let publicacion = null;
        let parentCommit = null;

        if (titulo) {
            publicacion = await Publicacion.findOne({ titulo: new RegExp(`^${titulo}$`, 'i') });
            if (!publicacion) {
                return res.status(404).json({
                    success: false,
                    message: "La publicación no existe"
                });
            }
        }

        if (parentCommitId) {
            parentCommit = await Commit.findById(parentCommitId);
            if (!parentCommit) {
                return res.status(404).json({
                    success: false,
                    message: "El comentario padre no existe"
                });
            }
        }

        if (!publicacion && !parentCommit) {
            return res.status(400).json({
                success: false,
                message: "Debe especificar un título de publicación o un comentario padre"
            });
        }

        const nuevoCommit = new Commit({
            textoprincipal,
            user: user._id,
            publicacion: publicacion ? publicacion._id : null,
            parentCommit: parentCommit ? parentCommit._id : null,
            status: true
        });

        const commitGuardado = await nuevoCommit.save();

        if (publicacion) {
            await Publicacion.findByIdAndUpdate(publicacion._id, {
                $push: { commit: commitGuardado._id }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Commit agregado correctamente",
            commit: {
                id: commitGuardado._id,
                texto: commitGuardado.textoprincipal,
                usuario: user.username,
                parentCommit: commitGuardado.parentCommit
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

export const listCommits = async (req, res) => {
    try {
        const { username, titulo } = req.query;

        const filtro = { status: true };

        if (username) {
            const user = await User.findOne({ username: username.toLowerCase() });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado"
                });
            }
            filtro.user = user._id;
        }

        if (titulo) {
            const publicacion = await Publicacion.findOne({ titulo: titulo.toLowerCase() });
            if (!publicacion) {
                return res.status(404).json({
                    success: false,
                    message: "Publicación no encontrada"
                });
            }
            filtro.publicacion = publicacion._id;
        }

        const commits = await Commit.find(filtro)
            .populate('user')
            .populate('publicacion') 
            .populate({
                path: 'parentCommit',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            });

        return res.status(200).json({
            success: true,
            total: commits.length,
            commits
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error al obtener los commits",
            error: err.message
        });
    }
};

