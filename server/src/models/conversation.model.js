import mongoose,{Schema} from "mongoose";

const conversationSchema= new Schema({
    conversationBetween:[
        {
            type:Schema.Types.ObjectId,
            ref:'User',
        }
    ],
    conversationMessages:[
        {
            type:Schema.Types.ObjectId,
            ref:'Message',
            default:[]
        }
    ]
},{timestamps:true})

export const Conversation= mongoose.model('Conversation', conversationSchema);