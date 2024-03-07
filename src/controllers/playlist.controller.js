import mongoose, {isValidObjectId} from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Comment } from "../models/comment.model.js"
import { Like } from "../models/like.model.js"
import { Tweet } from "../models/tweet.model.js"
import { ApiErrors } from "../utils/api-errors.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/async-handler.js"
import {ApiResponse} from "../utils/api-response.js"



const createPlaylist = asyncHandler(async (req, res, next) => {
    const {name, description} = req.body
    console.log("name is ", name );

    //TODO: create playlist
    if(!name){
       return next( new ApiErrors(400, "Playlist name cannot be empty"))
    }
      // retrieve the data of the user who created the playlist.
  try {
      const user = await User.findOne(req.user?._id);
      if(!user){
        return next( new ApiErrors(400, "unauthorized request"))
      }

      // check if the playlist already exists
      const duplicate = await Playlist.findOne({$and:[{name:name},{owner:req.user._id}]});
      console.log("duplicate exists ", duplicate);
      if(duplicate!=null){
        console.log("working here");
        console.log("duplicate is ", duplicate.name);
        //freezes after this line
       return next( new ApiErrors(400, "playlist already exists"))
      }

      const playList = await Playlist.create({
        name : name ,
        description: description??"",
         owner:req.user._id,
         videos:[]
      }
      )
      console.log("playlist is ", playList);
      if(!playList){
       return next( new ApiErrors(400, "Unable to create the playlist "))
        }
    
      
        return res.status(201).json(
            new ApiResponse(201,"Playlist created successfully", playList )
        );
      
  } catch (error) {
   return  next( new ApiErrors(500, "Something went wrong while creating the playlist"))
  }
})

 const getUserPlaylists = asyncHandler(async (req, res, next)=> {
  console.log(req.user);
  console.log("body is", String(req.user._id));
  // console.log("body is", req.params);
  //user can retrieve all his post by passing his id
const ownerId= String(req.user._id);
  // const {playlistId: ownerId}= req.params
  console.log("playlist id is ", ownerId);
  if(!ownerId){
    return next( new ApiErrors(400, "playlist id is required"))
  }

  //isValidObjectId is a mongoose function that checks if the id is a valid object id
  if(!isValidObjectId(ownerId)){
    return next(new ApiErrors(400, "invalid owner id"))
  }
  

  //retrieve the playlist data
  const playlists = await Playlist.aggregate([
    {
      $match:{
        // owner: new mongoose.Types.ObjectId(ownerId)
        owner:  new mongoose.Types.ObjectId(ownerId)
      }
    },
    {
      $lookup:{
        from: "videos",
        localField:"video",
        foreignField:"_id",
        as:"videos"
      }
    },
    {
      $addFields:{
        playlist:{
          $first:"$videos"
        }
      }
      
    }
  ])
  // console.log("playlist is ", playlists);
  if(!playlists){
    return next( new ApiErrors(404, "playlist not found"))
  
  }

  return res.status(200).json(
    new ApiResponse(200, "Playlist retrieved successfully", playlists)
  )

   
 })

 const getPlaylistById= asyncHandler(async(req, res, next )=>{
     const {playlistId}= req.params;
     if(!playlistId){
      return next(new ApiErrors(400, "playlist id is required"))
     }


    if(!isValidObjectId(playlistId)){
      return next(new ApiErrors(400, "invalid playlist id"))
    }
try{
  const playlist = await Playlist.findById(new mongoose.Types.ObjectId(playlistId));
  if(!playlist){
    return next(new ApiErrors(404, "playlist not found"))
  }
  console.log("playlist is ", playlist);
  return res.status(200).json(
    new ApiResponse(200, "Playlist retrieved successfully", playlist)
  )
}catch(error){
  return next(new ApiErrors(500, "Something went wrong while retrieving the playlist"))
}
   
 })

 const deletePlaylist= asyncHandler(async(req, res, next)=>{
  const{playlistId}= req.params;
  const userId= req.user._id;
  if(!playlistId){
    return next(new ApiErrors(400, "playlist id is required to delete the playlist"))
  }

  if(!isValidObjectId(playlistId)){
    return next(new ApiErrors(400, "invalid playlist id"))
  }

  try{
    const playlist=await  Playlist.findById(new mongoose.Types.ObjectId(playlistId));
    if(!playlist){
      throw new ApiErrors(404, "playlist not found")
    }
    console.log("playlist is ", playlist);
    console.log("playlist is ", playlist.owner);
    if(playlist.owner.toString()!==userId.toString()){
      console.log(playlist.owner.toString());
      console.log(userId.toString());
      throw new ApiErrors(403, "unauthorized request to delete the playlist")
    }

    
   const deletePlaylist=   await Playlist.findByIdAndDelete(
      new mongoose.Types.ObjectId(playlistId)
     );
    if(!deletePlaylist){
      throw new ApiErrors(500, "Unable to delete the playlist")
    }
    return res.status(200).json(
      new ApiResponse(200, "Playlist deleted successfully", deletePlaylist)
    )
  }catch(error){
    console.log("error is ", error);
    throw  new ApiErrors(500, "Something went wrong while deleting the playlist")
  }
 })

 const updatePlaylist = asyncHandler(async (req, res) => {
  const {playlistId} = req.params
  const {name, description} = req.body
  if(!playlistId){
    throw ApiErrors(400, "playlist id is required")
  }
  if(!name ){
    throw ApiErrors(400, "playlist name is required")
  }
  if(!isValidObjectId(playlistId)){
    throw ApiErrors(400, "invalid playlist id")
  }
  const playlist = await Playlist.findByIdAndUpdate(
    new mongoose.Types.ObjectId(playlistId),
    {name, description},
    {new:true}
  )
  if(!playlist){
    throw ApiErrors(500, "Unable to update the playlist")
  } 
  return res.status(201).json(new ApiResponse(201, "Playlist updated successfully", playlist))
})


export {
    createPlaylist,
    getUserPlaylists as getPlaylist ,
    getPlaylistById,
    deletePlaylist,
    updatePlaylist,
}