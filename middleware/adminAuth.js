import jwt from 'jsonwebtoken';
import Admin from "../model/adminModel.js"

const secret_key = process.env.JWT_SECRET_KEY_ADMIN;

// check the admin logged in 
export async function verifyAdmin(req , res , next )  {
  const authHeader = req.headers.authorization ;
  // getting token from headers
  if(authHeader) {
    // separating Bearer Token and take token only
    const token = authHeader.split(' ')[1];
    console.log(token);
  // verify that token with the secret_key ;
    jwt.verify(token , secret_key  , async(err , decoded) => {
        if(err) {
          res.json({status : false , message : "Permission not allowed" }) ;
        }else { 
        // finding the admin with the decoded id
          const admin = await Admin.findById(decoded.id) ;
  
          if(admin ) {
            // if admin true pass to the next function
            next() ;
          }else {
            res.json({status : false , message : "Admin not Exists"})
          }
        }
    })

  }else {
    res.json({ status : false , message : "Token not Provided "})
    next()
  }
}