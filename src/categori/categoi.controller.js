import Categoria from "./categori.model.js"
import Publicacion from "../publicaciones/publicacion.model.js"
export const addCategory = async (req, res) => {
    try {
        const data = req.body;
        const category = await Categoria.create({
            name: data.name
        })

        return res.status(201).json({
            message: "category added successfully",
            userDetails: {
                category: category.name
            }
        });

    } catch (error) {
        
        console.log(error);

        return res.status(500).json({
            message: "add category failed",
            error: error.message
        })

    }
}
export const editCategory = async (req, res = response) => {
    try {
        const {id} = req.params;
        const { _id, ...data} = req.body;

        const category = await Categoria.findByIdAndUpdate(id,data,{new:true});

        res.status(200).json({
            success:true,
            msg:'category Update',
            category
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error at Update category',
            error
        })
        
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const{id} = req.params;
        const category = await Categoria.findByIdAndUpdate(id, { status: false }, { new: true });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Categoría no encontrada"
            });
        }
        const categoriaDefault = await Categoria.findOne({ name: "default" });
        if (!categoriaDefault) {
            return res.status(500).json({
                success: false,
                message: "La categoría 'default' no existe"
            });
        }
        await Publicacion.updateMany(
            { category: id },  
            { category: categoriaDefault._id }
        );

        res.status(200).json({
            success: true,
            message: "Categoría desactivada y publicaciones actualizadas",
            category,
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