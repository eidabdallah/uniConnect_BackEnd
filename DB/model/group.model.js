import { model, Schema, Types , mongoose } from 'mongoose';

const groupSchema = new Schema({
  name: {
    type: String,
    required: true, 
    unique: true 
  },
  description: {
    type: String,
    required: true,  
  },
  image: {
    type: String,  
  },
  ownerId: {
    type: Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  members: [{
    type: Types.ObjectId,
    ref: 'User', 
  }],
  type: {
    type: String,
    enum: ['public', 'private'], 
    default: 'private', 
  },
  
}, {
  timestamps: true 
});

const groupModel = mongoose.models.Group || model('Group', groupSchema);
export default groupModel;
