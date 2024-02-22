import { asyncHandler } from "../utils/async-handler.js"
import {ApiErrors} from "../utils/api-errors.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.services.js"
import {ApiResponse} from "../utils/api-response.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


const generateAccessAndRefreshTokens = async(userId)=>{
try{
 const user =  await User.findById(userId);
 const accessToken = user.generateAccessToken()
const refreshToken =  user.generateRefreshToken()
 user.refreshToken = refreshToken
await  user.save({validateBeforeSave : false })
return {refreshToken, accessToken}
}catch(error){
  throw new ApiErrors(500,error)
}
}


const registerUser = asyncHandler( async(req, res)=>{
  // return res.status(201).json({message:"OK"})
  //Get user details form the user 
  // validation 
  // check duplication 
  // check for the images or avatar 
  // if avatar exist upload them to cloudinary 
  // check if the avatar is uploaded or not 
  //create user objects 
  // create entry in database 
  // filter password and refresh token from response 
  //check user creation 
  //return res
//request user details
  const {fullName , email , password , userName  }= req.body;
  //validation 
  if ([fullName,email,password,userName].some((field)=>field?.trim()==""))
  {
    throw new ApiErrors(400,"Required fields needs to be filled")
  }
  //check if username or email already exists 
 const existedUser= await  User.findOne({$or:[{email}, {userName}]});
  if(existedUser){
    throw new ApiErrors(409, "Username or email already exists ")
  }
  
  //check if images exists in the request.
  console.log("yaha k aairaxa ?")
  console.log(req.files.coverImage[0]?.path);

 const avatarLocalPath=  req.files?.avatar[0]?.path;
 console.log(req.files)
 console.log("working till here ",avatarLocalPath);

 let coverImageLocalPath;

 if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
  coverImageLocalPath= req.files.coverImage[0].path;
 }

 if(!avatarLocalPath){
  throw new ApiErrors(400 , "Avatar image is required")
 }


  const avatar =  await uploadOnCloudinary(avatarLocalPath);
  console.log("avatar is ",avatar)
 const coverImage= await uploadOnCloudinary(coverImageLocalPath);
 console.log("cover image is ", coverImage);
 if(!avatar){
  throw new ApiErrors(400, "Avatar is required on cloudinary")
 }

 const user =await User.create({
  fullName,
  avatar:avatar.url,
  coverImage :coverImage?.url || "",
  email,
  password,
  userName: userName
 })

 const createdUser= await User.findById(user._id).select("-password -refreshToken" );
 if(!createdUser){
  throw new ApiErrors(500, "server error while creating user")
 }
  return res.status(201).json(new ApiResponse(201,createdUser,"user has been created successfully"))


} )

const loginUser = asyncHandler(async (req, res)=>{
  try{
    //take user input 
    const {userName ,email,password}=req.body;
    if(!email && !userName){
      throw new ApiErrors(400,"Email or username is required")
    }
    console.log(email , password)
   const user = await  User.findOne({
      $or:[{userName},{email}]
    })
    if(!user){
      throw new ApiErrors(404, "user does not exists")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
      throw new ApiErrors(401, "Invalid user credentials")
    }
  const {accessToken, refreshToken}= await  generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  const options={
    httpOnly:true ,
    secure :true 
  }

  return res.status(200).cookie("accessToken",accessToken, options).cookie("refreshToken",refreshToken,options).json(
    new ApiResponse(
      200,
      "user logged in successfully",
      {
        user: loggedInUser, accessToken,refreshToken
      }
    )
  )


  }
  catch(error){
   throw new ApiErrors(500, error)
  }
})

const logoutUser= asyncHandler(async (req, res)=>{
  User.findByIdAndUpdate(
    req.user._id,{
      $unset:{
        refreshToken: 1
      }
    },
    {
      new:true 
    }
  )
  const options={
    httpOnly:true ,
    secure :true 
  }
  return res
         .status(200)
         .clearCookie("accessToken", options)
         .clearCookie("refreshToken",options).json(new ApiResponse(200, {}, "logged out successfully"))
})

const refreshAccessToken = asyncHandler(async(req, res)=>{
 const incomingRefreshToken= req.cookies.refreshToken||req.body.refreshToken
 if(!incomingRefreshToken){
  throw new ApiErrors(401, "unauthorized request ")
 }
try {
   const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  const  user = await User.findById(decodedToken?._id)
  if(!user){
    throw ApiErrors(401, "invalid refresh token ")
  }
   if(incomingRefreshToken != user?.refreshToken){
    throw new ApiErrors(401, "refresh token is expired or used ")
   }
  
   const options = {
    httpOnly:true,
    secure:true
   }
   const {accessToken , newRefreshToken }=await generateAccessAndRefreshTokens(user._id)
   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", newRefreshToken,options)
   .json(
    new ApiResponse(
      200,
       "access token refreshed",
      {
        accessToken, refreshToken:newRefreshToken
      },
     
    )
   )
} catch (error) {
  throw new ApiErrors(500, error?.message||"invalid refresh token ")
}
})

const  changeCurrentUserPassword = asyncHandler(async (req,res)=>{
  const {oldPassword, newPassword}=req.body
 const user = await User.findById(req.user?._id);
const isPasswordCorrect=  await user.isPasswordCorrect(oldPassword)
if(!isPasswordCorrect){
  throw new ApiErrors(400, "Invalid password!(password do not match)")
}
user.password= newPassword;
await user.save({validateBeforeSave:false } )

return res.status(200).json(new ApiResponse(200, "password changed successfully!"))
})
const getCurrentUser = asyncHandler(async(req,res)=>{
  return res.status(200).json(new ApiResponse(200, "current user fetched successfully",req.user))
})

const updateAccountDetails = asyncHandler(async(req, res )=>{
  const {fullName , userName , email , }=req.body
  if(!fullName || !email){
    throw new ApiErrors(400, "username and email is required")
  }
 const user = await  User.findByIdAndUpdate(req.user?._id,
    {
     fullName,
     email
    }
    ,{new:true}).select("-password")

    return res.status(200).json(new ApiResponse(200, "Account details updated successfully", req.user))

})

const updateUserAvatar= asyncHandler(async (req, res )=>{
const avatarLocalPath = req.file?.path
if(!avatarLocalPath){
  throw new ApiErrors(400, "No avatar detected")
}
const avatar = await uploadOnCloudinary(avatarLocalPath)
if(!avatar.url){
  throw new ApiErrors(400, "error while uploading the avatar file in cloudinary ")
}
const  user = User.findByIdAndDelete(req.user?._id,{
  $set:{
    avatar:avatar.url
  }
},{new:true }).select("-password")

return res.status(200).json(new ApiResponse(200, "avatar updated successfully ",
req.user
))
})

const updateCoverImage= asyncHandler(async(req,res)=>{
  const coverImageLocal = req.file?.path;
  if(!coverImageLocal){
    throw new ApiErrors(400,"unable to find coverImage")
  }
  const coverImage =await  uploadOnCloudinary(coverImageLocal);
  if(!coverImage){
    throw new ApiErrors(400, "unable to upload on cloudinary")
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
    $set:{  coverImage:coverImage.url,}

  },
  {new:true}).select("-password")

})

const getUserChannelProfile= asyncHandler(async(req, res)=>{
  const {userName}= req.params;
  console.log("username is ", userName);
  if(!userName?.trim()){
    throw new ApiErrors(400, "username is missing")
  }
 const channel = await User.aggregate([
   {
    $match: {
      userName:userName?.toLowerCase()
    }
   },
   {
        $lookup: {
          //subscriptions is there for the model Subscription because in database the model is saved in lowercase and plural form
         from: "subscriptions",
         localField: "_id",
         foreignField:"channel",
         as:"subscribers"
        }
   },
   {
    $lookup: {
         from: "subscriptions",
         localField: "_id",
         foreignField: "subscriber",
         as: "subscribedTo"
    },
   },
   {
    $addFields:{
      subscribersCount:{
        $size:"$subscribers"
      },
      channelsSubscribedToCount:{
        $size:"$subscribedTo"
      
      },
      isSubscribed:{
       $cond:{
        if:{in:[req.user?.id, "$subscribers.subscriber"]},
        then:true,
        else:false

        
       }
      }

    }
   },
   {
    $project:{
      fullName:1,
      isSubscribed:1,
      channelsSubscribedToCount:1,
      subscribersCount:1,
      email:1,
      coverImage:1,
      isSubscribed:1,
      avatar:1,

    }
   }
  ])
  
  console.log("channel value is ", channel);
  if(!channel?.length){
    throw new ApiErrors(404, "channel does not exists")
  }

  return res.status(200).json(
    new ApiResponse(200, "channel profile fetched successfully", channel[0])
  )

})

const getWatchHistory = asyncHandler(async(req, res)=>{
  const user = await User.aggregate(
    [
      {
        $match: {
          _id : new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as : "watchHistory",
          pipeline:[
            {
              $lookup:{
                from : "users",
                localField:"owner",
                foreignField: "_id",
                as : "owner",
                pipeline:[
                  {
                    $project:{
                      fullName:1,
                      userName:1,
                      avatar:1,
                    }
                  }
                ]
              }
            },
            {
              $addFields:{
                owner:{
                  $first:"$owner"
                }
              }
            }

          ]
        }
      }
    ]
  )
  return res.status(200).json(
    new ApiResponse(200, "Watch History fetched Successfully ", user[0].watchHistory)
  )
})






export { registerUser ,
loginUser,
logoutUser,
refreshAccessToken,
getCurrentUser,
changeCurrentUserPassword,
updateAccountDetails,
updateUserAvatar,
updateCoverImage,
getUserChannelProfile,
getWatchHistory
}
