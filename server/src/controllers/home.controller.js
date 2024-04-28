import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const home=asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(201,{
        Name:"Md Kaif Manzar",
        Project:"Chat App",
        Stack:"MERN Stack",
        Phone:"6200561062",
        Email:"kaifmanzar321@gmail.com"
    }, "Got Data Successfully!!"))
})

export {home}