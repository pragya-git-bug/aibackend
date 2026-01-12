const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUsersByRole,
  loginUser
} = require('../controller/userInformationController');

/**
 * @route POST /api/users/create
 * @desc Create a new user
 * @access Public
 * @tags User Information
 * @param {string} fullName.body.required - User's full name
 * @param {string} email.body.required - User's email address
 * @param {string} mobileNumber.body.required - User's mobile number
 * @param {string} password.body.required - User's password (min 6 characters)
 * @param {string} role.body.required - User's role
 * @param {string} className.body.required - User's class name
 */
router.post('/create', createUser);

/**
 * @route GET /api/users/all
 * @desc Get all users
 * @access Public
 * @tags User Information
 */
router.get('/all', getAllUsers);

/**
 * @route GET /api/users/role/:role
 * @desc Get all users by role
 * @access Public
 * @tags User Information
 * @param {string} role.path.required - User role (e.g., student, teacher, admin)
 */
router.get('/role/:role', getUsersByRole);

/**
 * @route POST /api/users/login
 * @desc Login user with email and password
 * @access Public
 * @tags User Information
 * @param {string} email.body.required - User's email address
 * @param {string} password.body.required - User's password
 */
router.post('/login', loginUser);

module.exports = router;

