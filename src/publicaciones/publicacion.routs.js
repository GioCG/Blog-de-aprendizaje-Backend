import { Router } from "express";
import {validarJWT} from "../middleware/validar-jwt.js"
import {publicacionValidator,editPublicacionValidator}from "../middleware/validator.js"
import { addPublicacion,editPublicacion,deletPublicacion,listPublicacion } from "../publicaciones/publicacion.controler.js";
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
  '/',
    listPublicacion
);  

export default router;