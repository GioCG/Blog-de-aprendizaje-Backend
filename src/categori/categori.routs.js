import { Router } from "express";
import { validarJWT } from "../middleware/validar-jwt.js";     
import {tieneRole} from "../middleware/validar-roles.js"
import { addCategory,editCategory,deleteCategory } from "../categori/categoi.controller.js";
import {deleteFileOnError} from "../middleware/delete-file-on-error.js"

const router = Router();
 
router.post(
    '/',
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        deleteFileOnError,
    ],
    addCategory
);
 
router.put(
    '/:id',
    [ 
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        deleteFileOnError,
    ],
    editCategory
)

router.delete(
    '/:id',
    [
        validarJWT,
        tieneRole("ADMIN_ROLE"),
        deleteFileOnError,
    ],
    deleteCategory
)
 
export default router;