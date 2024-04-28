import mongoose, {Schema} from "mongoose";

const messageSchema= new Schema({
    text:{
        type:String,
        required:true
    },
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
},{timestamps:true});

export const Message = mongoose.model("Message", messageSchema);