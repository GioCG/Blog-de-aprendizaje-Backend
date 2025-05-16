import Publicacion from '../publicaciones/publicacion.model.js'
import User from'../user/user.model.js'
import Categori from '../categori/categori.model.js'
import Commit from '../commit/commit.model.js'
import jwt from 'jsonwebtoken';

export const addPublicacion = async (req, res) => {
    try {
        const { titulo, textoprincipal, categoriname, username } = req.body;
        const lowerCategori = categoriname ? categoriname.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await User.findOne({ username: lowerUsername });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        let categori = await Categori.findOne({ name: "default" });
        if (lowerCategori) {
            const foundCategory = await Categori.findOne({ name: lowerCategori });
            if (!foundCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Categoría no encontrada"
                });
            }
            categori = foundCategory;
        }

        const publica = new Publicacion({
            titulo,
            textoprincipal,
            categori: categori._id, 
            user: user._id, 
            status: true 
        });

        await publica.save();

        return res.status(201).json({
            success: true,
            message: "Publicación agregada con éxito",
            publicDetails: {
                public: publica.titulo,
                user: user.toObject(),
                categori: categori.toObject(),
                status: publica.status
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error al agregar publicación",
            error: error.message
        });
    }
};



export const editPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.header("x-token");
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const { title, publicacioCategoria, textPrincipal } = req.body;
 
        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                msg: "Publicación no encontrada"
            });
        }
 
        if (publicacion.user.toString() !== uid) {
            return res.status(401).json({
                msg: "No tienes permiso para editar esta publicación"
            });
        }
 
        let categoryToUpdate = Publicacion.category;
 
        if (publicacioCategoria) {
            const categoryFound = await Categori.findOne({ nameCat: publicacioCategoria });
            if (!categoryFound) {
                return res.status(404).json({
                    msg: "La categoría seleccionada no existe"
                });
            }
            categoryToUpdate = categoryFound._id;
        }
 
        const actPublicacion = await Publicacion.findByIdAndUpdate( id, { title, publicacioCategoria: categoryToUpdate, textPrincipal }, { new: true })
 
        return res.status(200).json({
            success: true,
            msg: "PUBLICACION EDITADA CON EXITO!!!",
            publicacion: actPublicacion
        })
 
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Error al intentar actualizar los datos",
            error: err.message
        });
    }
};


export const deletPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.header("x-token");
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const publicacion = await Publicacion.findById(id);

        if (!publicacion) {
            return res.status(404).json({
                success: false,
                msg: "La publicación no existe"
            });
        }

        if (publicacion.user.toString() !== uid) {
            return res.status(401).json({
                success: false,
                msg: "No tienes acceso para eliminar esta publicación"
            });
        }

        if (publicacion.status === false) {
            return res.status(403).json({
                success: false,
                msg: "La publicación ya fue eliminada anteriormente"
            });
        }

        await Publicacion.findByIdAndUpdate(id, { status: false });

        await Commit.updateMany({ publicacion: id }, { status: false });

        return res.status(200).json({
            success: true,
            msg: "PUBLICACIÓN Y COMENTARIOS DESACTIVADOS CON ÉXITO!!!"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const listPublicacion = async (req, res) => {
    const { limite = 50, desde = 0} = req.query;
    const query = { status: true };

    try {
        
        const publicacion = await Publicacion.find(query)
            .skip(Number(desde))
            .limit(Number(limite));

        const OwnerName = await Promise.all(publicacion.map(async (publica) =>{
            const user = await User.findById(publica.user);
            return {
                ...publica.toObject(),
                user: user ? user.username : "Propietario no encontrado"
            }
        }));

        const total = await Publicacion.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            publicaciones: OwnerName
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener publicaciones',
            error
        })
    }
}
