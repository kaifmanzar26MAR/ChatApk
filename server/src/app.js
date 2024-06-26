import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import homeRouter from "./routes/home.routes.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js"
import bodyParser from "body-parser";
import { app } from "./connection/socket.js";
app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://chatapk.onrender.com",
    credentials: true,
  })
);
const __dirname= path.resolve();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes declaration
app.use("/api", homeRouter);
app.use("/api/user", userRouter);
app.use("/api/chat",chatRouter)

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
})

export { app };
