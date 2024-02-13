const mongoose = require("mongoose");

const ImageSchema = mongoose.Schema({
  name: {
    type: String,
  },

  description:{
    type:String
  },

  images: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  
  userCreate:[{
    user_create_Id:{
      type: String
    },
    user_create_name:{
      type:String
    },
    user_create_email:{
      type:String
    }

  }],
 

  created:{
    type:Number
  },

  ratings: {
    type: Number,
    default: 0,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: String,     
        // required: true,
      },
      name: {
        type: String,
        // required: true,
      },
      comment: {
        type: String,
        // required: true,
      },
    },
  ],

  userLikes:[{
    likes:{
      type:Number,
      default:0
    }

  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Image", ImageSchema);
