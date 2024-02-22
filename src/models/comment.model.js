import mongoose , {Schema} from "mongoose"

const commentSchema = new Schema(

    {
        content:{
            type: String ,
            required: [true , "Required field cant be null"]
        },
        //video on which content is commented out.
        video:{
            type : Schema.Types.ObjectId,
            ref: "Video" 
        },
        //the one who is commenting 
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        
    },
    {
        timestamps:true
    }

  
)

export const Comment = mongoose.model("Comment", commentSchema);