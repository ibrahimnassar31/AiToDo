import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  completionTime: { type: Number, default: 0 }, // Time taken to complete task (in minutes)
  productivityScore: { type: Number, min: 0, max: 100 }, // AI-generated score
  category: { type: String, trim: true }, // Task category for analysis
  priority: { type: String, enum: ['Low', 'Medium', 'High'] }, // Task priority
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

analyticsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Analytics', analyticsSchema);