import { model, Schema, Types, mongoose } from 'mongoose';
const notificationSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
  },
  notificationType: {
    type: String,
    enum: ['message', 'post', 'friend_request', 'group_invitation'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

const notificationModel = mongoose.models.Notification || model('Notification', notificationSchema);
export default notificationModel;
