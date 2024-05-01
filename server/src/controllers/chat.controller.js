import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";
import { getReceiverSocketId, io } from "../connection/socket.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { receiver, text } = req.body;

  // console.log(req.user);

  const sender=req.user._id;

  const message = new Message({
    sender,
    receiver,
    text,
  });

  if (!message) {
    throw new ApiError(500, "Error in Creating message!!");
  }

  let conversationInstance = await Conversation.findOne({
    conversationBetween: { $all: [sender, receiver] },
  });
  // console.log(conversationInstance)
  if (!conversationInstance) {
    conversationInstance = await Conversation.create({
        conversationBetween: [sender, receiver],
    });
    // console.log("new conversation", conversationInstance)

    if (!conversationInstance) {
      throw new ApiError(500, "Error in creating conversation!!");
    }
  }

  conversationInstance.conversationMessages.push(message._id);

  await Promise.all([conversationInstance.save(), message.save()]);

  const receiverSocketId= getReceiverSocketId(receiver);

  if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage", message)
  }

  // console.log(conversationInstance);

  return res
    .status(200)
    .json(new ApiResponse(201, conversationInstance, "Message Sent!!"));
});


const getAllConversationMessage= asyncHandler(async(req,res)=>{
  const {member} = req.body;
  const sender=req.user._id;

  let conversationInstance = await Conversation.findOne({
    conversationBetween: { $all: [sender, member] },
  }).populate("conversationMessages");

  if (!conversationInstance) {
    conversationInstance=[];
  }

  return res.status(200).json(new ApiResponse(201, conversationInstance.conversationMessages, "Got Message Sussessfully!!"))

})

export { sendMessage, getAllConversationMessage };
