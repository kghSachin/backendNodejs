import { Router } from "express";
import { createPlaylist, deletePlaylist, getPlaylist , getPlaylistById} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const playlistRouter = Router();
playlistRouter.route("/create-playlist").post(verifyJWT,createPlaylist);
playlistRouter.route("/get-all-playlist").get(verifyJWT,getPlaylist);
playlistRouter.route("/p/:playlistId").get(verifyJWT,getPlaylistById);
playlistRouter.route("/d/:playlistId").get(verifyJWT,deletePlaylist);


export default playlistRouter;