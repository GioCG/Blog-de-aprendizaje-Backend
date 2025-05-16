import {Router} from "express";
<<<<<<< HEAD
import {editarCommit,agregarCommit,eliminarCommit,listCommits} from "../commit/commit.controler.js"
=======
import {editarCommit,agregarCommit,eliminarCommit} from "../commit/commit.controler.js"
>>>>>>> 3a5537f2f0acc8beddc5e011761d2b78cfe9151f
import { deleteFileOnError } from "../middleware/delete-file-on-error.js";
import {check} from "express-validator";
import { existeUsuarioById } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        deleteFileOnError
    ],

    agregarCommit
);

router.put(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        deleteFileOnError
    ],

    editarCommit
);

router.delete(
    "/:id",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        deleteFileOnError
    ],
    
    eliminarCommit
);

<<<<<<< HEAD
router.get(
    "/",
    [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioById),
        deleteFileOnError
    ],
    listCommits
);

=======
>>>>>>> 3a5537f2f0acc8beddc5e011761d2b78cfe9151f
export default router;