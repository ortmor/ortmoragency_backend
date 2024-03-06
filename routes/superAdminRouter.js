import express from "express";
import { authAdmin,SuperAdminLogin } from "../controllers/superAdminController.js";
import validate from "../middleware/validateBody.js";
import { loginSchema } from "../Utils/yupSchema.js";
// import { verifySuperAdmin } from "../middleware/superAdminAuth.js";





const router = express.Router();

// Admin Auth routes
router.get ("/auth"  , authAdmin ) ;
router.post("/login", validate(loginSchema) , SuperAdminLogin); 

// router.use(verifySuperAdmin)



export default router;
