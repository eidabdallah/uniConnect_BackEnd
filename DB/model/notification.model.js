import { model, Schema, Types , mongoose} from 'mongoose';
const notificationSchema = new Schema({
  userId: { 
    type: Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

const notificationModel = mongoose.models.Notification || model('Notification', notificationSchema);
export default notificationModel;
