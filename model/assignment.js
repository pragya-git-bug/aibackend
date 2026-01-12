const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  teacherCode: {
    type: String,
    required: [true, 'Teacher code is required'],
    trim: true
  },
  assignmentName: {
    type: String,
    required: [true, 'Assignment name is required'],
    trim: true
  },
  assignmentCode: {
    type: String,
    unique: true,
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  assignedTo: {
    type: String,
    required: [true, 'Assigned to is required'],
    trim: true
  },
  questions: {
    type: Map,
    of: {
      questionNo: {
        type: Number,
        required: true
      },
      question: {
        type: String,
        required: true,
        trim: true
      },
      difficulties: {
        type: String,
        trim: true
      }
    },
    default: {}
  },
  submissions: {
    type: Map,
    of: {
      answers: [{
        questionNo: {
          type: Number,
          required: true
        },
        answer: {
          type: String,
          required: true,
          trim: true
        },
        rate: {
          type: Number,
          min: 0,
          max: 10,
          default: 0
        }
      }],
      overallScore: {
        type: Number,
        default: null
      },
      submissionDate: {
        type: Date,
        default: null
      },
      teacherComments: {
        type: String,
        default: null,
        trim: true
      },
      summary: {
        type: String,
        default: null,
        trim: true
      },
      needPractice: {
        type: [String],
        default: []
      },
      topicUnderCovered: {
        type: [String],
        default: []
      },
      status:{
        type: String,
        enum: ['pending', 'submitted', 'reviewed'],
        default: 'pending'
      },
      resources: [{
        type: {
          type: String,
          trim: true
        },
        link: {
          type: String,
          trim: true
        }
      }]
    },
    default: {}
  }
}, {
  timestamps: true
});

// Generate unique assignmentCode before saving
assignmentSchema.pre('save', async function() {
  if (!this.isNew || this.assignmentCode) {
    return;
  }
  
  const AssignmentModel = this.constructor;
  let assignmentCode;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    attempts++;
    // Generate assignmentCode: first 3 letters of assignmentName + random 4 digits
    const namePrefix = this.assignmentName.substring(0, 3).toUpperCase().replace(/\s/g, '') || 'ASS';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    assignmentCode = `${namePrefix}${randomDigits}`;
    
    // Check if assignmentCode already exists
    try {
      const existingAssignment = await AssignmentModel.findOne({ assignmentCode });
      if (!existingAssignment) {
        isUnique = true;
      }
    } catch (error) {
      isUnique = true;
    }
  }
  
  if (!isUnique) {
    throw new Error('Unable to generate unique assignmentCode after multiple attempts');
  }
  
  this.assignmentCode = assignmentCode;
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;

