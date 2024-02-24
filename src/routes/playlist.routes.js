import { Router } from "express";
import { createPlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const playlistRouter = Router();
playlistRouter.route("/create-playlist").post(verifyJWT,createPlaylist);


export default playlistRouter;