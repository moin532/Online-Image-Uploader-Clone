const express = require('express');
const router =  express.Router();

const { getallImage, createImage, updateImage, likesUser,Deleteimage,getAdminProducts, craeteProductReview, getallReviews, deleteReview, getImagedetails } = require('../controller/imageController');
const {authenticateToken} = require('../middleware/AuthMiddleware');


router.route("/images").get(getallImage);
router.route("/image/:id").get(getImagedetails);
router.route("/image/new").post(authenticateToken,createImage);
router.route('/admin/images').get(authenticateToken,getAdminProducts )

router.route("/image/:id").put(updateImage);
router.route("/image/:id").delete(Deleteimage);
router.route("/review").put(craeteProductReview); //direct use token;
router.route("/reviews").get(getallReviews);
router.route("/reviews").delete(authenticateToken,deleteReview);

router.route('/user/like').put(likesUser);

module.exports = router
