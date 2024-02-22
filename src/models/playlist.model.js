import mongoose , {Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const playListSchema= new Schema(
    {
       videos:  [
            {
                    type: Schema.Types.ObjectId,
                    ref: "Video"
            }
        ],
        name :{
            type: String ,
            required: true
        },
        description:{
            type: String ,
            required: false,
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
    },
    {
  timestamps: true
    }
)

playListSchema.plugin.mongooseAggregatePaginate;

export const Playlist = mongoose.model("Playlist", playListSchema);