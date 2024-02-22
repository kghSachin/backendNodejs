import mongoose, {isValidObjectId} from "mongoose"
import { Playlist } from "../models/playlist.model"
import { Comment } from "../models/comment.model"
import { Like } from "../models/like.model"
import { Tweet } from "../models/tweet.model"
import { ApiErrors } from "../utils/api-errors"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/async-handler"
import {ApiResponse} from "../utils/api-response.js"



const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    if(!name){
        throw new ApiErrors(400, "Playlist name cannot be empty")
    }
      // retrieve the data of the user who created the playlist.
  try {
      const user = await User.findOne(req.user?._id);
      if(!user){
          new ApiErrors(400, "unauthorized request")
      }
  
      const playList =new Playlist(
         name = name ,
         description= description??"",
          owner=req.user._id,
          videos=[]
      )
      if(!playList){
          new ApiErrors(400, "Unable to create the playlist ")
      }
     
        return res.status(201).json(
            new ApiResponse(201,"Playlist created successfully", playList )
        );
      
  } catch (error) {
    new ApiErrors(500, "Something went wrong while creating the playlist")
  }
    



})


export {
    createPlaylist
}