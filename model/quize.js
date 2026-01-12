const mongoose = require('mongoose');

const quizeSchema = new mongoose.Schema({
  teacherCode: {
    type: String,
    required: [true, 'Teacher code is required'],
    trim: true
  },
  quizeName: {
    type: String,
    required: [true, 'Quiz name is required'],
    trim: true
  },
  quizeCode: {
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
      options: {
        op1: {
          type: String,
          required: true,
          trim: true
        },
        op2: {
          type: String,
          required: true,
          trim: true
        },
        op3: {
          type: String,
          required: true,
          trim: true
        },
        op4: {
          type: String,
          required: true,
          trim: true
        }
      },
      correctOption: {
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
        match: {
          type: Boolean,
          default: false
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
      status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
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

// Generate unique quizeCode before saving
quizeSchema.pre('save', async function() {
  if (!this.isNew || this.quizeCode) {
    return;
  }
  
  const QuizeModel = this.constructor;
  let quizeCode;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    attempts++;
    // Generate quizeCode: first 3 letters of quizeName + random 4 digits
    const namePrefix = this.quizeName.substring(0, 3).toUpperCase().replace(/\s/g, '') || 'QUI';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    quizeCode = `${namePrefix}${randomDigits}`;
    
    // Check if quizeCode already exists
    try {
      const existingQuize = await QuizeModel.findOne({ quizeCode });
      if (!existingQuize) {
        isUnique = true;
      }
    } catch (error) {
      isUnique = true;
    }
  }
  
  if (!isUnique) {
    throw new Error('Unable to generate unique quizeCode after multiple attempts');
  }
  
  this.quizeCode = quizeCode;
});

const Quize = mongoose.model('Quize', quizeSchema);

module.exports = Quize;

