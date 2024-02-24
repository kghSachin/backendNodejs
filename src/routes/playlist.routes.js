import { Router } from "express";
import { createPlaylist, getPlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const playlistRouter = Router();
playlistRouter.route("/create-playlist").post(verifyJWT,createPlaylist);
playlistRouter.route("/p/:playlistId").get(verifyJWT,getPlaylist);


export default playlistRouter;