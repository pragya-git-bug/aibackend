const express = require('express');
const router = express.Router();
const {
  addAssignment,
  submitAssignment,
  reviewAssignment,
  getAllAssignments,
  getAssignmentsByAssignedTo,
  getAssignmentsByTeacherCode,
  getSubmittedStudents,
  getAssignmentWithStudentSubmission,
  getStudentReport,
  getAssignmentByCode
} = require('../controller/assignmentController');

/**
 * @route POST /api/assignments/add
 * @desc Create a new assignment
 * @access Public
 * @tags Assignments
 * @param {string} teacherCode.body.required - Teacher code
 * @param {string} assignmentName.body.required - Assignment name
 * @param {string} subject.body.required - Subject name
 * @param {string} dueDate.body.required - Due date (ISO format)
 * @param {string} assignedTo.body.required - Class or group assigned to
 * @param {object} questions.body.required - Questions object (HashMap)
 */
router.post('/add', addAssignment);

/**
 * @route POST /api/assignments/submit
 * @desc Submit assignment by student
 * @access Public
 * @tags Assignments
 * @param {string} assignmentCode.body.required - Assignment code
 * @param {string} studentCode.body.required - Student code
 * @param {array} answers.body.required - Answers array with questionNo, answer, and rate
 */
router.post('/submit', submitAssignment);

/**
 * @route POST /api/assignments/review
 * @desc Review assignment by teacher
 * @access Public
 * @tags Assignments
 * @param {string} assignmentCode.body.required - Assignment code
 * @param {string} studentCode.body.required - Student code
 * @param {number} overallScore.body.optional - Overall score
 * @param {string} teacherComments.body.optional - Teacher comments
 * @param {string} summary.body.optional - Summary
 * @param {array} needPractice.body.optional - Topics needing practice
 * @param {array} topicUnderCovered.body.optional - Topics under covered
 * @param {array} resources.body.optional - Resources array
 * @param {object} questionRatings.body.optional - Question ratings object (e.g., {q1: 6, q2: 8} or {1: 6, 2: 8})
 */
router.post('/review', reviewAssignment);

/**
 * @route GET /api/assignments/all
 * @desc Get all assignments
 * @access Public
 * @tags Assignments
 */
router.get('/all', getAllAssignments);

/**
 * @route GET /api/assignments/assigned-to/:assignedTo
 * @desc Get all assignments by assignedTo
 * @access Public
 * @tags Assignments
 * @param {string} assignedTo.path.required - Class or group assigned to (e.g., 8class A)
 */
router.get('/assigned-to/:assignedTo', getAssignmentsByAssignedTo);

/**
 * @route GET /api/assignments/teacher/:teacherCode
 * @desc Get all assignments by teacherCode
 * @access Public
 * @tags Assignments
 * @param {string} teacherCode.path.required - Teacher code
 */
router.get('/teacher/:teacherCode', getAssignmentsByTeacherCode);

/**
 * @route GET /api/assignments/submitted-students/:assignmentCode
 * @desc Get all students who submitted the assignment
 * @access Public
 * @tags Assignments
 * @param {string} assignmentCode.path.required - Assignment code
 */
router.get('/submitted-students/:assignmentCode', getSubmittedStudents);

/**
 * @route GET /api/assignments/student-submission/:assignmentCode/:studentCode
 * @desc Get assignment data with specific student's submission
 * @access Public
 * @tags Assignments
 * @param {string} assignmentCode.path.required - Assignment code
 * @param {string} studentCode.path.required - Student code
 */
router.get('/student-submission/:assignmentCode/:studentCode', getAssignmentWithStudentSubmission);

/**
 * @route GET /api/assignments/student-report/:studentCode
 * @desc Get student report with completed assignments, scores, and student information
 * @access Public
 * @tags Assignments
 * @param {string} studentCode.path.required - Student code
 */
router.get('/student-report/:studentCode', getStudentReport);

/**
 * @route GET /api/assignments/:assignmentCode
 * @desc Get assignment by code
 * @access Public
 * @tags Assignments
 * @param {string} assignmentCode.path.required - Assignment code
 */
router.get('/:assignmentCode', getAssignmentByCode);

module.exports = router;

