const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"pls enter your name"],
        maxLength:[30,"Name cannot Exceed"],
        minLength:[4,"Name should be morethan 4 cahracter"],       
    },
    email:{
        type:String,
        required:[true,"pls Enter your Email"],
        unique:true,
        validate:[validator.isEmail,"pls enter a valid email"],
    },

    password:{
        type:String,
        required:[true,"pls Enter your password"],
        minLength:[8,"password should greater then 8"],
        select:false
    },

    posts:[{
      type:mongoose.Schema.Types.ObjectId,
      ref: "Image",
    }],

    

    avatar: {
        public_id: {
          type: String,
          
        },
        url: {
          type: String,
          
        },
      },


    role:{
        type:String,
        default:"user"
    },


    createdAt: {
        type: Date,
        default: Date.now,
      },
      
    resetPasswordToken:String,
    resetPasswordExpire: Date,
    
});



// userSchema.pre("save",async function(next){

//   if(!this.isModified('password')){
//       next();
//   }
//   this.password =await bcrypt.hash(this.password,10);
// });

 //jwt Token genrate toekn and store in cookie
 userSchema.methods.getJWTToken = function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRE
  });
 } ;

 //comaprepassword
 userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password)
}


//reset passwoed token
userSchema.methods.getResetpasswordToken = function(){

  //genrtating a token
  const restToken = crypto.randomBytes(20).toString('hex');

  //hashing and adding to userschema;
  this. resetPasswordToken =crypto
  .createHash("sha256").update(restToken).digest('hex');
  
  this.resetPasswordExpire = Date.now() + 15 *60 * 1000;

  return restToken;
}

module.exports= mongoose.model('User',userSchema)