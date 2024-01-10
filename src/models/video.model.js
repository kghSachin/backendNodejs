import mongoose, {Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
       videoFile:{
            type:String,
            required:[true, "Required field can't be null"],

        },
       thumbnail:{
            type:String,
            required:[true, "Required field can't be null"],

        },
       description:{
            type:String,
            required:[true, "Required field can't be null"],

        },
       title:{
            type:String,
            required:[true, "Required field can't be null"],

        },
       duration :{
            type:Number,
            required:[true, "Required field can't be null"],

        },
      views:{
        type:Number,
        default:0,
      },
      isPublished :{
        type: Boolean,
        default: true,
      },
      owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
      }

    
},{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginate)
export const Video= mongoose.Model("Video",videoSchema)