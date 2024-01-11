import { asyncHandler } from "../utils/async-handler.js"


const registerUser = asyncHandler( async(req, res)=>{
  return res.status(201).json({message:"OK"})
} )


export { registerUser }
