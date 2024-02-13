const ErrorHander = require("../utils/Erroehandler");
const User = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
//?registeer a usr
exports.register = catchAsyncError(async (req, res, next) => {

  
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
  });

  const { name, password, email } = req.body;

  const isEmail = await User.findOne({email:email});

  if(isEmail){
    return next(new ErrorHander("Email Already exist", 400)); 
  }

  const salt = await bcrypt.genSalt();
  const hashedPwd = await bcrypt.hash(password, salt);

  const user = await User.create({
    name:  name,
    email:email,
    password: hashedPwd
    // avatar: {
    //   public_id: myCloud.public_id,
    //   url: myCloud.secure_url,
    // },
    // avatar: {
    //   public_id: "ww.com",
    //   url: "https.com",
    // },

  });

  const token = jwt.sign({
    userdata : user
  },process.env.JWT_SECRET)
  
  res.status(200).json({
      success:true,
      token
  })
  
});

//!login
exports.loginuser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user has given pass and email both
  if (!email || !password) {
    return next(new ErrorHander("Pls ENter a valid email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password"); //because pass default false so call select

  
  if (!user) {
    return next(new ErrorHander("Invalid email and password", 401));
  }

  //password matching user
  const isPasSwordMatch = await user.comparePassword(password);
  if (!isPasSwordMatch) {
    return next(new ErrorHander("Invalid  password", 401));
  }

  const token = jwt.sign({
    userdata : user
  },process.env.JWT_SECRET);

  res.status(200).json({
    success:true,
    token
})

});

//!logout user
exports.logout = catchAsyncError(async (req, res, next) => {
  
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    succes: true,
    message: "logged out",
  });
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHander("user Not found", 404));
  }

  //!get reset pasword token
  const resetToken = user.getResetpasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `your password reset token is :-\n\n ${resetPasswordUrl} \n\n if you have not requested email then pls ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "PhotoUploader password recovery",
      message,
    });

    res.status(200).json({
      succes: true,
      message: `email Send ${user.email} succesfully`,
    });
  } catch (error) {
    (user.resetPasswordToken = undefined),
      (user.resetPasswordExpire = undefined);

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHander(error.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //?creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, //gretaer then
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password token is Invalid or Has been expired ",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("password does not matched", 400));
  }

  //?to-->
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  
  const token = req.headers.authorization;

    
    if (!token) {
      return res.sendStatus(401, "Empty token"); // Unauthorized..x
    }

    const secretKey = process.env.JWT_SECRET;
   
    const user= jwt.verify(token,secretKey);

    res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  // const user = await User.findById(req.user.id).select("+password");
  const {id} = req.body;
  const user = await User.findById(id).select("+password");

  const isspaswordMatch = await user.comparePassword(req.body.oldPassword);

  if (!isspaswordMatch) {
    return next(new ErrorHander("old password is incorrect", 401));
  }

  if (req.body.password !== req.body.confirmpassword) {
    return next(new ErrorHander("password does not matched", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    succes: true,
    user,
  });

  sendToken(user, 200, res);
});

exports.UpdateProfile = catchAsyncError(async (req, res, next) => {
  const newUserdata = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});


//? users fopr admin
exports.AllusersAdmin = catchAsyncError(async(req,res,next)=>{
  const user = await User.find();

  res.status(200).json({
    success:true,
    user
  })
});

exports.getSingleUserAdmin = catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.params.id);

  if(!user){
    new ErrorHander(`user does not exist this id:${req.params.id}`,404);
  }

  res.status(200).json({
    success:true,
    user
  })
});

exports.DeleteUser = catchAsyncError(async(req,res,next)=>{
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHander("user not found",404))
  };

  await user.remove();

  res.status(200).json({
     succes:true,
     message:"deleted succesfully"
  })
})
