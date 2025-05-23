import {Router} from "express";
import {editarCommit,agregarCommit,eliminarCommit,searchCommitsByUsername} from "../commit/commit.controler.js"
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

router.get(
  "/:username",
  [
    check("username", "El username es obligatorio").notEmpty(),
    deleteFileOnError
  ],
  searchCommitsByUsername
);


export default router;