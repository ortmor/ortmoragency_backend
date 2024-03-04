import moment from "moment/moment.js";
import { sendBlogNotification } from "../Helpers/newBlogAddedMail.js";
import Blog from "../model/blogModel.js";


//add blogs

export async function addBlog(req, res) {
  try {
    const {
      title,
      shortDescription,
      metaTitle,
      metaDescription,
      metaTag,
      slug,
      date,
      content,
    } = req.body;

    if (
      !title ||
      !shortDescription ||
      !metaTitle ||
      !metaDescription ||
      !metaTag ||
      !slug ||
      !date ||
      !content
    ) {
      res.status(400).json({ status: false, message: "All fields are mandatory" });
      return;
    }

    // upload each blog to cloudinary
    const uploadBlogToCloudinary = async (blogContent) => {
      if (blogContent) {
        const uploadedBlog = await cloudinary.uploader.upload(blogContent, {
          folder: "ortmor", // setting folder to upload
          resource_type: "raw",
        });
        return uploadedBlog.secure_url || "";
      }
      return ;
    };

    // Update content for adding blog into Cloudinary
    const updatedContent = await Promise.all(
      content.map(async (blog) => {
        const uploadedBlogContent = await uploadBlogToCloudinary(blog.content);
        return {
          blog: uploadedBlogContent,
        };
      })
    );

    req.files.image[0].path = req.files.image[0].path.substring("public".length);
    const formattedDate = moment(date, "DD-MM-YYYY").toDate();

    const blogInstance = new Blog({
      title,
      shortDescription,
      metaTitle,
      metaDescription,
      metaTag,
      slug,
      date:formattedDate,
      image: req.files.image[0].path,
      content,
    });

    await blogInstance.save();

  


    // Creating a message object for sending email messages
    const message = {
      blogName: `${title} - ${shortDescription}`,
      blog: title,
    };

    res.status(200).json({ status: true, message: "Blog has been added successfully" });

    // Sending an email notification about the blog added
    await sendBlogNotification(process.env.ADMIN_EMAIL, message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
}

//get blogs

export async function getBlog (req , res) {

  try {
    
    // finding All blog and find the title details also by populating
    const blog = await Blog.find().skip(req.paginatedResults.startIndex).limit(req.paginatedResults.limit).populate('title').lean()
    if(blog) {
      res.status(200).json({ status : true , blog , pagination : req.paginatedResults})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status : false , message : " Internal Server Error "}) ;
  }
}

// Delete blog

export async function deleteBlog (req , res) {
  try {
    // Find course by id and delete 
    console.log('Received blogId:', req.params.blogId);

  const deletedBlog = await Blog.findByIdAndDelete(req.params.blogId) ;

  if(deletedBlog) { 
    res.status(200).json({status : true , message : " Blog deleted successfully" })
  }else{
    res.status(500).json({ status : false , message : "Internal Server Error" })
  }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status : false , message : "Internal server error" })
  }

} 


// Edit blog Details
export async function EditBlogDetails (req , res) {
  try {

    //find blog based on blog id 
    const blog = await Blog.findOne({ _id : req.body.blogId })

    if (!blog) {
      return res.status(404).json({ status: false, message: "blog not found" });
    }
   
    // Handling blog thumbnail image
    let image;
    if(req.files?.image) {
      req.files.image[0].path = req.files.image[0].path.substring('public'.length);
      image = req.files.image[0] ;
    }else {
      image = blog.image ;
    }




     // upload each Assignment to cloudinary
     const uploadBlogToCloudinary = async (blogContent) => {
      if (blogContent) {
        const uploadedBlog = await cloudinary.uploader.upload(blogContent, {
          folder: "ortmor", // setting folder to upload
          resource_type: "raw",
        });
        return uploadedBlog.secure_url || "";
      }
      return uploadBlogToCloudinary;
    };

    

      Blog.updateOne({ _id : req.body.blogId  } , {
        $set : {
          title : req.body.title,
          shortDescription: req.body.shortDescription,
          metaTitle: req.body.metaTitle,
          metaDescription : req.body.metaDescription,
          metaTag: req.body.metaTag,
          slug : req.body.slug ,
          content:req.body.content ,
          image:req.files.image[0]  ,
      
        }
      }).then((response) => {
        res.status(200).json({ status : true , message : " Blog updated Successfully" })
      })
    
  } catch (error) {
    console.log(error);
    res.json({ status : true , message : "Internal server Error "})
  }
}
