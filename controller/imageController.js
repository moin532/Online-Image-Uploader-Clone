const Image = require("../models/imageModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/Erroehandler");
const catchAssyncError = require("../middleware/catchAsyncError");
const ApiFeauture = require("../utils/apiFeauture");
const cloudinary = require('cloudinary');
const jwt = require("jsonwebtoken");
const sendEmail = require('../utils/sendEmail');

//creating image
exports.createImage = catchAssyncError(async (req, res, next) => {
    // //adding cloudinary

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }


  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }


  req.body.images = imagesLinks;

 const user_data = ({
  "user_create_Id" : req.body.user_create_Id,
  "user_create_name" : req.body.user_create_name,
  "user_create_email" : req.body.user_create_email,
 })
  
 req.body.userCreate = user_data;
  const image = await Image.create(req.body);
  await image.save();

  //send email to a user
  const url = `${req.protocol}://${req.get("host")}/images`;
  const message = `Congrats Your Image Upload Succesfull:- \n\n ${url} \n\n Visit On url Thank You \n\n regards \n admin `;
   const userEmail =  req.body.user_create_email;
 

  try {
    await sendEmail({
      email: userEmail,
      subject: "Image Upload",
      message,
    });


  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }

  res.status(201).json({
    succes: true,
    image,
  });
});

//get all
exports.getallImage = catchAssyncError(async (req, res) => {
  // const users = await User.findById(req.user.id);
  // req.body.user = req.user.id;
  // if(req.body === users._id){}

  const apifeauture = new ApiFeauture(Image.find(), req.query).search();
  const images = await apifeauture.query.populate("user");
  const imageCount = await Image.countDocuments();

  res.status(200).json({
    succes: true,
    images,
    imageCount,
  });
});

exports.getImagedetails = catchAssyncError(async (req, res, next) => {
  const imagess = await Image.findById(req.params.id).populate("user");
  // const user = await User.findById(imagess.user_id);

  if (!imagess) {
    next(new ErrorHandler("image not found", 404));
  }

  res.status(200).json({
    success: true,
    imagess,
  });
});

//update image
exports.updateImage = catchAssyncError(async (req, res, next) => {
  let image = await Image.findById(req.params.id);

  if (!image) {
    return next(new ErrorHandler("Image not found", 404));
  }

  image = await Image.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    succes: true,
    image,
  });
});

//delete image
exports.Deleteimage = catchAssyncError(async (req, res, next) => {
  let image = await Image.findById(req.params.id);

  if (!image) {
    return res.status(500).json({
      succes: false,
      message: "image not found",
    });
  }

  //deleting images from cloudinary
  for (let i = 0; i < image.images.length; i++) {
    await cloudinary.v2.uploader.destroy(image.images[i].public_id);
  }

  await image.remove();

  res.status(200).json({
    succes: true,
    message: "image deleted succesfully",
  });
});

// adding review
exports.craeteProductReview = catchAssyncError(async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.sendStatus(401, "login to get token"); // Unauthorized..x
  }
  const secretKey = process.env.JWT_SECRET;

  const user = jwt.verify(token, secretKey);

  const { rating, comment, imageId } = req.body;

  const review = {
    user: user.userdata._id,
    name: user.userdata.name,
    comment,
  };

  const image = await Image.findById(imageId);

  const isReviewed = image.reviews.find(
    (rev) => rev.user === user.userdata._id
  );

  if (isReviewed) {
    image.reviews.forEach((rev) => {
      if (rev.user === user.userdata_id)
        (rev.comment = comment), (rev.name = user.userdata.name);
    });
  } else {
    image.reviews.push(review);
    image.numOfReviews = image.reviews.length;
  }
  let avg = 0;

  image.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  image.ratings = image.reviews.length;

  await image.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

exports.getallReviews = catchAssyncError(async (req, res, next) => {
  const image = await Image.findById(req.query.id);

  if (!image) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: image.reviews,
  });
});

exports.deleteReview = catchAssyncError(async (req, res, next) => {
  const product = await Image.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = reviews.length;
  }

  const numOfReviews = reviews.length;

  await Image.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

//likes
exports.likesUser = catchAssyncError(async (req, res) => {
  const { likes, imageId } = req.body;

  const like = {
    likes,
  };

  const image = await Image.findById(imageId);

  image.userLikes.push(like);
  image.numofLikes = image.userLikes.length;

  await image.save({ validateBeforeSave: false });

  res.status(200).json({
    sucess: true,
    // LikeCount
  });
});

//ADMIN IMAGE

exports.getAdminProducts = catchAssyncError(async (req, res) => {
  const imagesAdmin = await Image.find();
  res.status(200).json({
    succes: true,
    imagesAdmin,
  });
});
