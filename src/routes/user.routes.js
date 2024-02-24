import { Router } from "express"
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentUserPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1
        },
        {
            name : "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(
    loginUser
)


//secured route 
router.route("/logout").post(verifyJWT,
  logoutUser
)
router.route("/refreshToken").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentUserPassword)
router.route("/get-current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account-detail").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)
router.route("/c/:userName").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)


export default router