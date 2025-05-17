import { Router } from "express";
import {publicacionValidator}from "../middleware/validator.js"
import { addPublicacion,searchPublicationsByCategory } from "../publicaciones/publicacion.controler.js";
import {deleteFileOnError} from "../middleware/delete-file-on-error.js"

const router = Router();
 
router.post(
    '/',
    [
        publicacionValidator,
        deleteFileOnError,
    ],
    addPublicacion
);
 
router.get(
  '/:category',
    searchPublicationsByCategory
);  

export default router;