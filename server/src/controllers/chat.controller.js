import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { Conversation } from "../models/conversation.model.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { sender, receiver, text } = req.body;

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
  console.log(conversationInstance)
  if (!conversationInstance) {
    conversationInstance = await Conversation.create({
        conversationBetween: [sender, receiver],
    });
    console.log("new conversation", conversationInstance)

    if (!conversationInstance) {
      throw new ApiError(500, "Error in creating conversation!!");
    }
  }

  conversationInstance.conversationMessages.push(message._id);

  await Promise.all([conversationInstance.save(), message.save()]);

  console.log(conversationInstance);

  return res
    .status(200)
    .json(new ApiResponse(201, conversationInstance, "Message Sent!!"));
});

export { sendMessage };
