import { Router } from "express";
import { GetUserById, getCurrentUser, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/userregister").post(registerUser);
router.route("/userlogin").post(loginUser)
router.route("/getuserbyid/:id").get(GetUserById);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/logout").get(verifyJWT,logoutUser);

export default router;
