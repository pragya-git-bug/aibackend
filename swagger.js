require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();
const fs = require('fs');

// Use environment variables for Swagger configuration
const host = process.env.SWAGGER_HOST || 'localhost:3000';
const schemes = host.includes('localhost') ? ['http'] : ['https'];

const doc = {
  info: {
    title: 'Learning Portal API',
    description: 'API documentation for Learning Portal application',
    version: '1.0.0',
  },
  host: host,
  schemes: schemes,
  tags: [
    {
      name: 'User Information',
      description: 'User information management endpoints'
    },
    {
      name: 'Assignments',
      description: 'Assignment management endpoints'
    },
    {
      name: 'Quizes',
      description: 'Quiz management endpoints'
    }
  ],
  definitions: {
    User: {
      fullName: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '1234567890',
      password: 'password123',
      role: 'student',
      className: 'Class 10'
    },
    UserResponse: {
      _id: '507f1f77bcf86cd799439011',
      fullName: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '1234567890',
      role: 'student',
      className: 'Class 10',
      userCode: 'JOH1234',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    Login: {
      email: 'john@example.com',
      password: 'password123'
    },
    Error: {
      success: false,
      message: 'Error message here'
    },
    Success: {
      success: true,
      message: 'Success message here'
    },
    Question: {
      questionNo: 1,
      question: 'What is 2+2?',
      difficulties: 'Easy'
    },
    Questions: {
      q1: {
        questionNo: 1,
        question: 'What is 2+2?',
        difficulties: 'Easy'
      },
      q2: {
        questionNo: 2,
        question: 'Solve for x: 2x + 5 = 15',
        difficulties: 'Medium'
      }
    },
    AddAssignment: {
      teacherCode: 'TEA1234',
      assignmentName: 'Math Assignment 1',
      subject: 'Mathematics',
      dueDate: '2024-09-15',
      assignedTo: '8class A',
      questions: {
        q1: {
          questionNo: 1,
          question: 'What is 2+2?',
          difficulties: 'Easy'
        },
        q2: {
          questionNo: 2,
          question: 'Solve for x: 2x + 5 = 15',
          difficulties: 'Medium'
        }
      }
    },
    StudentAnswer: {
      questionNo: 1,
      answer: '4',
      rate: 6
    },
    SubmitAssignment: {
      assignmentCode: 'MAT1234',
      studentCode: 'STU5678',
      answers: [
        {
          questionNo: 1,
          answer: '4',
          rate: 6
        },
        {
          questionNo: 2,
          answer: 'x = 5',
          rate: 5
        }
      ]
    },
    ReviewAssignment: {
      assignmentCode: 'MAT1234',
      studentCode: 'STU5678',
      overallScore: 85,
      teacherComments: 'Good work!',
      summary: 'This assignment covers algebra and geometry topics.',
      needPractice: ['Geometry'],
      topicUnderCovered: ['Algebra', 'Geometry'],
      questionRatings: {
        q1: 6,
        q2: 8
      },
      resources: [
        {
          type: 'pdf',
          link: 'http://example.com/math_assignment_1.pdf'
        }
      ]
    },
    QuizQuestion: {
      questionNo: 1,
      question: 'What is 2+2?',
      options: {
        op1: '3',
        op2: '4',
        op3: '5',
        op4: '6'
      },
      correctOption: 'op2',
      difficulties: 'Easy'
    },
    AddQuize: {
      teacherCode: 'TEA1234',
      quizeName: 'Math Quiz 1',
      subject: 'Mathematics',
      dueDate: '2024-09-15',
      assignedTo: '8class A',
      questions: {
        q1: {
          questionNo: 1,
          question: 'What is 2+2?',
          options: {
            op1: '3',
            op2: '4',
            op3: '5',
            op4: '6'
          },
          correctOption: 'op2',
          difficulties: 'Easy'
        },
        q2: {
          questionNo: 2,
          question: 'What is 3*3?',
          options: {
            op1: '6',
            op2: '7',
            op3: '8',
            op4: '9'
          },
          correctOption: 'op4',
          difficulties: 'Medium'
        }
      }
    },
    SubmitQuize: {
      quizeCode: 'QUI1234',
      studentCode: 'STU5678',
      answers: [
        {
          questionNo: 1,
          answer: 'op2'
        },
        {
          questionNo: 2,
          answer: 'op4'
        }
      ]
    },
    ReviewQuize: {
      quizeCode: 'QUI1234',
      studentCode: 'STU5678',
      overallScore: 90,
      teacherComments: 'Excellent work!',
      summary: 'This quiz covers basic arithmetic operations.',
      needPractice: [],
      topicUnderCovered: ['Multiplication'],
      resources: [
        {
          type: 'pdf',
          link: 'http://example.com/math_quiz_1.pdf'
        }
      ]
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  // Read the generated swagger file
  const swaggerDoc = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
  
  // Add tags to user-related endpoints
  if (swaggerDoc.paths['/api/users/create'] && swaggerDoc.paths['/api/users/create'].post) {
    swaggerDoc.paths['/api/users/create'].post.tags = ['User Information'];
  }
  
  if (swaggerDoc.paths['/api/users/all'] && swaggerDoc.paths['/api/users/all'].get) {
    swaggerDoc.paths['/api/users/all'].get.tags = ['User Information'];
  }
  
  if (swaggerDoc.paths['/api/users/role/{role}'] && swaggerDoc.paths['/api/users/role/{role}'].get) {
    swaggerDoc.paths['/api/users/role/{role}'].get.tags = ['User Information'];
  }
  
  if (swaggerDoc.paths['/api/users/login'] && swaggerDoc.paths['/api/users/login'].post) {
    swaggerDoc.paths['/api/users/login'].post.tags = ['User Information'];
  }
  
  // Update AddAssignment definition to allow dynamic question keys
  if (swaggerDoc.definitions && swaggerDoc.definitions.AddAssignment) {
    // Update questions to use additionalProperties for dynamic keys
    swaggerDoc.definitions.AddAssignment.properties.questions.additionalProperties = {
      '$ref': '#/definitions/Question'
    };
  }
  
  // Add tags to assignment-related endpoints and update schemas
  if (swaggerDoc.paths['/api/assignments/add'] && swaggerDoc.paths['/api/assignments/add'].post) {
    swaggerDoc.paths['/api/assignments/add'].post.tags = ['Assignments'];
    // Update the body schema to use the AddAssignment definition
    if (swaggerDoc.paths['/api/assignments/add'].post.parameters && 
        swaggerDoc.paths['/api/assignments/add'].post.parameters[0] &&
        swaggerDoc.paths['/api/assignments/add'].post.parameters[0].schema) {
      swaggerDoc.paths['/api/assignments/add'].post.parameters[0].schema = {
        '$ref': '#/definitions/AddAssignment'
      };
    }
  }
  
  if (swaggerDoc.paths['/api/assignments/submit'] && swaggerDoc.paths['/api/assignments/submit'].post) {
    swaggerDoc.paths['/api/assignments/submit'].post.tags = ['Assignments'];
    // Update the body schema to use the SubmitAssignment definition
    if (swaggerDoc.paths['/api/assignments/submit'].post.parameters && 
        swaggerDoc.paths['/api/assignments/submit'].post.parameters[0] &&
        swaggerDoc.paths['/api/assignments/submit'].post.parameters[0].schema) {
      swaggerDoc.paths['/api/assignments/submit'].post.parameters[0].schema = {
        '$ref': '#/definitions/SubmitAssignment'
      };
    }
  }
  
  if (swaggerDoc.paths['/api/assignments/review'] && swaggerDoc.paths['/api/assignments/review'].post) {
    swaggerDoc.paths['/api/assignments/review'].post.tags = ['Assignments'];
    // Update the body schema to use the ReviewAssignment definition
    if (swaggerDoc.paths['/api/assignments/review'].post.parameters && 
        swaggerDoc.paths['/api/assignments/review'].post.parameters[0] &&
        swaggerDoc.paths['/api/assignments/review'].post.parameters[0].schema) {
      swaggerDoc.paths['/api/assignments/review'].post.parameters[0].schema = {
        '$ref': '#/definitions/ReviewAssignment'
      };
    }
  }
  
  if (swaggerDoc.paths['/api/assignments/all'] && swaggerDoc.paths['/api/assignments/all'].get) {
    swaggerDoc.paths['/api/assignments/all'].get.tags = ['Assignments'];
  }
  
  if (swaggerDoc.paths['/api/assignments/assigned-to/{assignedTo}'] && swaggerDoc.paths['/api/assignments/assigned-to/{assignedTo}'].get) {
    swaggerDoc.paths['/api/assignments/assigned-to/{assignedTo}'].get.tags = ['Assignments'];
  }
  
  if (swaggerDoc.paths['/api/assignments/teacher/{teacherCode}'] && swaggerDoc.paths['/api/assignments/teacher/{teacherCode}'].get) {
    swaggerDoc.paths['/api/assignments/teacher/{teacherCode}'].get.tags = ['Assignments'];
  }
  
  if (swaggerDoc.paths['/api/assignments/submitted-students/{assignmentCode}'] && swaggerDoc.paths['/api/assignments/submitted-students/{assignmentCode}'].get) {
    swaggerDoc.paths['/api/assignments/submitted-students/{assignmentCode}'].get.tags = ['Assignments'];
  }
  
  if (swaggerDoc.paths['/api/assignments/student-submission/{assignmentCode}/{studentCode}'] && swaggerDoc.paths['/api/assignments/student-submission/{assignmentCode}/{studentCode}'].get) {
    swaggerDoc.paths['/api/assignments/student-submission/{assignmentCode}/{studentCode}'].get.tags = ['Assignments'];
  }
  
  if (swaggerDoc.paths['/api/assignments/student-report/{studentCode}'] && swaggerDoc.paths['/api/assignments/student-report/{studentCode}'].get) {
    swaggerDoc.paths['/api/assignments/student-report/{studentCode}'].get.tags = ['Assignments'];
  }
  
  if (swaggerDoc.paths['/api/assignments/{assignmentCode}'] && swaggerDoc.paths['/api/assignments/{assignmentCode}'].get) {
    swaggerDoc.paths['/api/assignments/{assignmentCode}'].get.tags = ['Assignments'];
  }
  
  // Update AddQuize definition to allow dynamic question keys
  if (swaggerDoc.definitions && swaggerDoc.definitions.AddQuize) {
    swaggerDoc.definitions.AddQuize.properties.questions.additionalProperties = {
      '$ref': '#/definitions/QuizQuestion'
    };
  }
  
  // Add tags to quiz-related endpoints and update schemas
  if (swaggerDoc.paths['/api/quizes/add'] && swaggerDoc.paths['/api/quizes/add'].post) {
    swaggerDoc.paths['/api/quizes/add'].post.tags = ['Quizes'];
    if (swaggerDoc.paths['/api/quizes/add'].post.parameters && 
        swaggerDoc.paths['/api/quizes/add'].post.parameters[0] &&
        swaggerDoc.paths['/api/quizes/add'].post.parameters[0].schema) {
      swaggerDoc.paths['/api/quizes/add'].post.parameters[0].schema = {
        '$ref': '#/definitions/AddQuize'
      };
    }
  }
  
  if (swaggerDoc.paths['/api/quizes/submit'] && swaggerDoc.paths['/api/quizes/submit'].post) {
    swaggerDoc.paths['/api/quizes/submit'].post.tags = ['Quizes'];
    if (swaggerDoc.paths['/api/quizes/submit'].post.parameters && 
        swaggerDoc.paths['/api/quizes/submit'].post.parameters[0] &&
        swaggerDoc.paths['/api/quizes/submit'].post.parameters[0].schema) {
      swaggerDoc.paths['/api/quizes/submit'].post.parameters[0].schema = {
        '$ref': '#/definitions/SubmitQuize'
      };
    }
  }
  
  if (swaggerDoc.paths['/api/quizes/review'] && swaggerDoc.paths['/api/quizes/review'].post) {
    swaggerDoc.paths['/api/quizes/review'].post.tags = ['Quizes'];
    if (swaggerDoc.paths['/api/quizes/review'].post.parameters && 
        swaggerDoc.paths['/api/quizes/review'].post.parameters[0] &&
        swaggerDoc.paths['/api/quizes/review'].post.parameters[0].schema) {
      swaggerDoc.paths['/api/quizes/review'].post.parameters[0].schema = {
        '$ref': '#/definitions/ReviewQuize'
      };
    }
  }
  
  if (swaggerDoc.paths['/api/quizes/all'] && swaggerDoc.paths['/api/quizes/all'].get) {
    swaggerDoc.paths['/api/quizes/all'].get.tags = ['Quizes'];
  }
  
  if (swaggerDoc.paths['/api/quizes/assigned-to/{assignedTo}'] && swaggerDoc.paths['/api/quizes/assigned-to/{assignedTo}'].get) {
    swaggerDoc.paths['/api/quizes/assigned-to/{assignedTo}'].get.tags = ['Quizes'];
  }
  
  if (swaggerDoc.paths['/api/quizes/teacher/{teacherCode}'] && swaggerDoc.paths['/api/quizes/teacher/{teacherCode}'].get) {
    swaggerDoc.paths['/api/quizes/teacher/{teacherCode}'].get.tags = ['Quizes'];
  }
  
  if (swaggerDoc.paths['/api/quizes/submitted-students/{quizeCode}'] && swaggerDoc.paths['/api/quizes/submitted-students/{quizeCode}'].get) {
    swaggerDoc.paths['/api/quizes/submitted-students/{quizeCode}'].get.tags = ['Quizes'];
  }
  
  if (swaggerDoc.paths['/api/quizes/student-submission/{quizeCode}/{studentCode}'] && swaggerDoc.paths['/api/quizes/student-submission/{quizeCode}/{studentCode}'].get) {
    swaggerDoc.paths['/api/quizes/student-submission/{quizeCode}/{studentCode}'].get.tags = ['Quizes'];
  }
  
  if (swaggerDoc.paths['/api/quizes/{quizeCode}'] && swaggerDoc.paths['/api/quizes/{quizeCode}'].get) {
    swaggerDoc.paths['/api/quizes/{quizeCode}'].get.tags = ['Quizes'];
  }
  
  // Write the modified swagger file back
  fs.writeFileSync(outputFile, JSON.stringify(swaggerDoc, null, 2));
  console.log('Tags assigned to endpoints successfully!');
});

