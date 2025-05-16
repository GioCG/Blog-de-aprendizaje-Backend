import { Router } from "express";
import { validarJWT } from "../middleware/validar-jwt.js";     
import {tieneRole} from "../middleware/validar-roles.js"
import { addCategori,editCategori,deleteCategori } from "../categori/categoi.controller.js";
import {deleteFileOnError} from "../middleware/delete-file-on-error.js"

const router = Router();
 
router.post(
    '/',
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        deleteFileOnError,
    ],
    addCategori
);
 
router.put(
    '/:id',
    [ 
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        deleteFileOnError,
    ],
    editCategori
)

router.delete(
    '/:id',
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        deleteFileOnError,
    ],
    deleteCategori
)
 
export default router;