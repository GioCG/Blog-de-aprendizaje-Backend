import Publicacion from '../publicaciones/publicacion.model.js'
import User from'../user/user.model.js'
import Categoria from '../categori/categori.model.js'
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

        let categori = await Category.findOne({ name: "default" });
        if (lowerCategori) {
            const foundCategory = await Category.findOne({ name: lowerCategori });
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
            categori: Category._id, 
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
                categori: Category.toObject(),
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
            const categoryFound = await Category.findOne({ nameCat: publicacioCategoria });
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

async function populateChildCommits(commits) {
  return Promise.all(commits.map(async commit => {
    const populatedCommit = await Commit.findById(commit._id)
      .populate('user', 'username')
      .populate({
        path: 'childCommits',
        match: { status: true }
      }).lean();

    if (populatedCommit.childCommits && populatedCommit.childCommits.length > 0) {
      populatedCommit.childCommits = await populateChildCommits(populatedCommit.childCommits);
    }

    return populatedCommit;
  }));
}

export const searchPublicationsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const categoria = await Categoria.findOne({
      name: new RegExp(`^${category}$`, "i"),
      status: true,
    });

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: `No se encontró la categoría "${category}"`,
      });
    }

    const publicaciones = await Publicacion.find({
      category: categoria._id,
      status: true,
    })
      .populate("category", "name -_id")
      .populate("user", "username -_id")
      .populate({
        path: "commit",
        match: { parentCommit: null }, 
        populate: { path: 'user', select: 'username -_id' }
      })
      .lean();

    for (const pub of publicaciones) {
      pub.commit = await populateChildCommits(pub.commit);
    }

    res.json({
      success: true,
      total: publicaciones.length,
      publications: publicaciones,
    });
  } catch (error) {
    console.error("Error al buscar publicaciones por categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error al buscar publicaciones por categoría",
      error: error.message,
    });
  }
};

