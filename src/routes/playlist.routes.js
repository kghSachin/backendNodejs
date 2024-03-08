import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylist , getPlaylistById, removeVideoFromPlaylist, updatePlaylist} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const playlistRouter = Router();
playlistRouter.route("/create-playlist").post(verifyJWT,createPlaylist);
playlistRouter.route("/get-all-playlist").get(verifyJWT,getPlaylist);
playlistRouter.route("/p/:playlistId").get(verifyJWT,getPlaylistById);
playlistRouter.route("/d/:playlistId").get(verifyJWT,deletePlaylist);
playlistRouter.route("/u/:playlistId").post(verifyJWT,updatePlaylist);
playlistRouter.route("/a/:playlistId/:videoId").patch(verifyJWT,addVideoToPlaylist);
playlistRouter.route("/r/:playlistId/:videoId").patch(verifyJWT,removeVideoFromPlaylist);


export default playlistRouter;