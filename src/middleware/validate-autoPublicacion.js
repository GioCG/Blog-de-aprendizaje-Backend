import Publicacion from "../publicaciones/publicacion.model.js";

/**
 * @param {String} titulo - Título de la publicación.
 * @param {ObjectId} categoriaId - ID de la categoría.
 * @returns {Boolean} - Retorna true si ya existe la publicación.
 */
export const existePublicacion = async (titulo, categoriaId) => {
  try {
    const existe = await Publicacion.findOne({
      titulo,
      category: categoriaId
    });

    return !!existe;
  } catch (error) {
    console.error("Error al validar duplicado de publicación:", error.message);
    return false;
  }
};
