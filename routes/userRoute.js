const express = require('express');
const router =  express.Router();
const{register, loginuser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, UpdateProfile, AllusersAdmin, getSingleUserAdmin, DeleteUser} = require('../controller/userController')
const {isAuthenticated, authorizeRoles  } = require('../middleware/auth')

router.route('/register').post(register);
router.route('/login').post(loginuser);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(getUserDetails);
router.route('/password/update').put(updatePassword);
router.route('/me/update').put(isAuthenticated,UpdateProfile);

router.route('/admin/users').get(AllusersAdmin);
router.route('/admin/user/:id').get(isAuthenticated,authorizeRoles("admin"),getSingleUserAdmin);
router.route('/admin/user/:id').delete(DeleteUser);

module.exports = router;