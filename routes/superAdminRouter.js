import express from "express";
import { authAdmin,SuperAdminLogin,getAllAdmin,addAdmin } from "../controllers/superAdminController.js";
import validate from "../middleware/validateBody.js";
import { loginSchema } from "../Utils/yupSchema.js";
import paginatedResults from "../middleware/pagination.js";
import { verifySuperAdmin } from "../middleware/superAdminAuth.js";





const router = express.Router();

// Admin Auth routes
router.get ("/auth"  , authAdmin ) ;
router.post("/login", validate(loginSchema) , SuperAdminLogin); 

router.use(verifySuperAdmin)

// Admin Tutor Management
router.post("/add-Admin" , addAdmin);
router.get ("/get-Admin" , paginatedResults() , getAllAdmin) ;


export default router;
