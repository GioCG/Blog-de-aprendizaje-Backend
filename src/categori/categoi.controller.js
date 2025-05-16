import Categori from "./categori.model.js"
import Publicacion from "../publicaciones/publicacion.model.js"
export const addCategori = async (req, res) => {
    try {
        const data = req.body;
        const categori = await Categori.create({
            name: data.name
        })

        return res.status(201).json({
            message: "categori added successfully",
            userDetails: {
                categori: categori.name
            }
        });

    } catch (error) {
        
        console.log(error);

        return res.status(500).json({
            message: "add categori failed",
            error: error.message
        })

    }
}
export const editCategori = async (req, res = response) => {
    try {
        const {id} = req.params;
        const { _id, ...data} = req.body;

        const categori = await Categori.findByIdAndUpdate(id,data,{new:true});

        res.status(200).json({
            success:true,
            msg:'categori Update',
            categori
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error at Update categori',
            error
        })
        
    }
}

export const deleteCategori = async (req, res) => {
    try {
        const{id} = req.params;
        const categori = await Categori.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!categori) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }
        const categoriaDefault = await Categori.findOne({ name: "default" });
        if (!categoriaDefault) {
            return res.status(500).json({
                success: false,
                message: "La categoría 'default' no existe"
            });
        }
        await Publicacion.updateMany(
            { categori: id },  
            { categori: categoriaDefault._id }
        );

        res.status(200).json({
            success: true,
            message: "Categoría desactivada y publicaciones actualizadas",
            categori,
            reassignedTo: categoriaDefault.name
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Error al desactivar categoría",
            error: error.message
        });
    }
}