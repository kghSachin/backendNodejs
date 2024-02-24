import mongoose, {isValidObjectId} from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Comment } from "../models/comment.model.js"
import { Like } from "../models/like.model.js"
import { Tweet } from "../models/tweet.model.js"
import { ApiErrors } from "../utils/api-errors.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/async-handler.js"
import {ApiResponse} from "../utils/api-response.js"



const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    console.log("name is ", name );

    //TODO: create playlist
    if(!name){
        throw new ApiErrors(400, "Playlist name cannot be empty")
    }
      // retrieve the data of the user who created the playlist.
  try {
      const user = await User.findOne(req.user?._id);
      if(!user){
        throw  new ApiErrors(400, "unauthorized request")
      }

      // check if the playlist already exists
      const duplicate = await Playlist.findOne({$and:[{name:name},{owner:req.user._id}]});
      console.log("duplicate exists ", duplicate);
      if(duplicate.name!=null){
        console.log("working here");
        console.log("duplicate is ", duplicate.name);
        //freezes after this line
       throw new ApiErrors(400, "playlist already exists")
      }
       console.log("but not working here")

      const playList = await Playlist.create({
        name : name ,
        description: description??"",
         owner:req.user._id,
         videos:[]
      }
      )
      console.log("playlist is ", playList);
      if(!playList){
        throw  new ApiErrors(400, "Unable to create the playlist ")
        }
    
      
        return res.status(201).json(
            new ApiResponse(201,"Playlist created successfully", playList )
        );
      
  } catch (error) {
    new ApiErrors(500, "Something went wrong while creating the playlist")
  }
})

 const getPlaylist = asyncHandler((req, res)=>{

 })


export {
    createPlaylist,
    getPlaylist
}