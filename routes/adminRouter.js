import express from "express";
import {
  generateOtp,
  doSignup,
  login,
  forgotPassword,
  chackingOtp,
  changePassword,

} from "../controllers/adminController.js";
import {addBlog,getBlog,deleteBlog,EditBlogDetails} from "../controllers/blogController.js"
import { loginSchema, signupSchema } from "../Utils/yupSchema.js";
import validate from "../middleware/validateBody.js";
import uploadImage from "../middleware/image-upload.js";
import paginatedResults from "../middleware/pagination.js";
// import { verifyAdmin } from '../middleware/adminAuth.js';

const router = express.Router();
  

//For Admin

router.post("/signup", validate(signupSchema), generateOtp);
router.post("/otp", doSignup);
router.post("/login", validate(loginSchema), login);

// login with google

// router.post("/auth/login/google" , googleAuth)

// Verifyning the Authorization ;
// router.use(verifyAdmin)

// Change Password
router.post("/forgot-password", forgotPassword);
router.post("/chacking-Otp", chackingOtp);
router.post("/change-Password", changePassword);


//For Blog
router.post('/add-Blog' ,uploadImage('./public/images/blog'), addBlog )
router.get('/get-Blog' ,paginatedResults(),getBlog)
router.delete('/delete-Blog/:blogId' , deleteBlog) 
router.put('/update-Blog' ,  uploadImage('./public/images/blog' ) ,EditBlogDetails)


export default router;
