const express = require('express');
const router = express.Router();
const {
  addQuize,
  submitQuize,
  reviewQuize,
  getAllQuizes,
  getQuizeByCode,
  getQuizesByAssignedTo,
  getQuizesByTeacherCode,
  getSubmittedStudents,
  getQuizeWithStudentSubmission
} = require('../controller/quizeController');

/**
 * @route POST /api/quizes/add
 * @desc Create a new quiz
 * @access Public
 * @tags Quizes
 * @param {string} teacherCode.body.required - Teacher code
 * @param {string} quizeName.body.required - Quiz name
 * @param {string} subject.body.required - Subject name
 * @param {string} dueDate.body.required - Due date (ISO format)
 * @param {string} assignedTo.body.required - Class or group assigned to
 * @param {object} questions.body.required - Questions object (HashMap)
 */
router.post('/add', addQuize);

/**
 * @route POST /api/quizes/submit
 * @desc Submit quiz by student
 * @access Public
 * @tags Quizes
 * @param {string} quizeCode.body.required - Quiz code
 * @param {string} studentCode.body.required - Student code
 * @param {array} answers.body.required - Answers array with questionNo and answer
 */
router.post('/submit', submitQuize);

/**
 * @route POST /api/quizes/review
 * @desc Review quiz by teacher
 * @access Public
 * @tags Quizes
 * @param {string} quizeCode.body.required - Quiz code
 * @param {string} studentCode.body.required - Student code
 * @param {number} overallScore.body.optional - Overall score
 * @param {string} teacherComments.body.optional - Teacher comments
 * @param {string} summary.body.optional - Summary
 * @param {array} needPractice.body.optional - Topics needing practice
 * @param {array} topicUnderCovered.body.optional - Topics under covered
 * @param {array} resources.body.optional - Resources array
 */
router.post('/review', reviewQuize);

/**
 * @route GET /api/quizes/all
 * @desc Get all quizzes
 * @access Public
 * @tags Quizes
 */
router.get('/all', getAllQuizes);

/**
 * @route GET /api/quizes/assigned-to/:assignedTo
 * @desc Get all quizzes by assignedTo
 * @access Public
 * @tags Quizes
 * @param {string} assignedTo.path.required - Class or group assigned to
 */
router.get('/assigned-to/:assignedTo', getQuizesByAssignedTo);

/**
 * @route GET /api/quizes/teacher/:teacherCode
 * @desc Get all quizzes by teacherCode
 * @access Public
 * @tags Quizes
 * @param {string} teacherCode.path.required - Teacher code
 */
router.get('/teacher/:teacherCode', getQuizesByTeacherCode);

/**
 * @route GET /api/quizes/submitted-students/:quizeCode
 * @desc Get all students who submitted the quiz
 * @access Public
 * @tags Quizes
 * @param {string} quizeCode.path.required - Quiz code
 */
router.get('/submitted-students/:quizeCode', getSubmittedStudents);

/**
 * @route GET /api/quizes/student-submission/:quizeCode/:studentCode
 * @desc Get quiz data with specific student's submission
 * @access Public
 * @tags Quizes
 * @param {string} quizeCode.path.required - Quiz code
 * @param {string} studentCode.path.required - Student code
 */
router.get('/student-submission/:quizeCode/:studentCode', getQuizeWithStudentSubmission);

/**
 * @route GET /api/quizes/:quizeCode
 * @desc Get quiz by code
 * @access Public
 * @tags Quizes
 * @param {string} quizeCode.path.required - Quiz code
 */
router.get('/:quizeCode', getQuizeByCode);

module.exports = router;

