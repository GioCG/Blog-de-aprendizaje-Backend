import Categori from "../src/categori/categori.model.js";

export const createDefaultCategori = async () => {
  try {
    const defaultCategories = ["practicasupervisada", "talleriii", "tecnologia"];

    for (const name of defaultCategories) {
      const exists = await Categori.findOne({ name });

      if (exists) {
        console.log(`La categoría "${name}" ya existe.`);
        continue;
      }

      const newCategory = new Categori({ name });
      await newCategory.save();
      console.log(`Categoría "${name}" creada exitosamente.`);
    }
  } catch (err) {
    console.error("Error al crear las categorías por defecto:", err.message);
  }
};
