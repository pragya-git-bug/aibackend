const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userInformationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  className: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true
  },
  userCode: {
    type: String,
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});

// Generate unique userCode before saving
userInformationSchema.pre('save', async function() {
  if (!this.isNew || this.userCode) {
    return;
  }
  
  if (!this.fullName || this.fullName.trim().length === 0) {
    throw new Error('Full name is required to generate userCode');
  }
  
  const UserModel = this.constructor;
  let userCode;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    attempts++;
    // Generate userCode: first 3 letters of fullName + random 4 digits
    const namePrefix = this.fullName.substring(0, 3).toUpperCase().replace(/\s/g, '') || 'USR';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    userCode = `${namePrefix}${randomDigits}`;
    
    // Check if userCode already exists
    try {
      const existingUser = await UserModel.findOne({ userCode });
      if (!existingUser) {
        isUnique = true;
      }
    } catch (error) {
      // If query fails, try with generated code anyway
      isUnique = true;
    }
  }
  
  if (!isUnique) {
    throw new Error('Unable to generate unique userCode after multiple attempts');
  }
  
  this.userCode = userCode;
});

// Hash password before saving
userInformationSchema.pre('save', async function() {
  // Skip if password is not modified
  if (!this.isModified('password')) {
    return;
  }
  
  // Only hash if password exists and is a string
  if (!this.password || typeof this.password !== 'string') {
    throw new Error('Password must be a string');
  }
  
  // Only hash if it's not already hashed (bcrypt hashes start with $2)
  if (this.password.startsWith('$2')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userInformationSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserInformation = mongoose.model('UserInformation', userInformationSchema);

module.exports = UserInformation;

