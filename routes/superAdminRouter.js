import express from "express";
import { SuperAdminLogin } from "../controllers/superAdminController.js";
import validate from "../middleware/validateBody.js";
import { loginSchema } from "../Utils/yupSchema.js";





const router = express.Router();

// Admin Auth routes
// router.get ("/auth"  , authAdmin ) ;
router.post("/login", validate(loginSchema) , SuperAdminLogin); 



export default router;
