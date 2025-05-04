import { model, Schema, Types, mongoose } from 'mongoose';

const groupRequestSchema = new Schema({
  groupId: { 
    type: Types.ObjectId, 
    ref: 'Group', 
    required: true
  },
  userId: { 
    type: Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, { 
  timestamps: true 
});

const groupRequestModel = mongoose.models.GroupRequest || model('GroupRequest', groupRequestSchema);
export default groupRequestModel;
