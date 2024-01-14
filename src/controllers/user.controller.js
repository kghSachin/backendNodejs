import { asyncHandler } from "../utils/async-handler.js"
import {ApiErrors} from "../utils/api-errors.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.services.js"
import {ApiResponse} from "../utils/api-response.js"


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


export { registerUser }
