import mongoose, {Schema} from "mongoose"


const likeSchema = new Schema(
    {
        owner :{
            type: Schema.Types.ObjectId,
             ref: "User"
        },
        comment :{
            type : Schema.Types.ObjectId,
            ref: "Comment" 
        },
        likedBy:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        video :{
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        tweet :{
            type: Schema.type.ObjectId,
            ref:"Tweet"
        }

        
    },
    {
        timestamps:true
    }
    
)

export const Like = mongoose.model("Like", likeSchema)
