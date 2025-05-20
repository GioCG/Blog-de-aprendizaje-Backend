import { config } from "dotenv";
import { initServer } from './configs/server.js'
import {createAdmin} from "./configs/createAdmin.js"
import { createDefaultCategori } from "./configs/createCategori.js";
import { createPublicaciones } from "./configs/createPublicaciones.js";
import { createAnoni } from "./configs/createAnon.js";

config();
initServer();
createAdmin();
createDefaultCategori();
createPublicaciones();
createAnoni();