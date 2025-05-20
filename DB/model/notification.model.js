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
    enum: ['message', 'post', 'friend_request', 'group_join_request', 'group_request_response', 'Comment', 'Like'],
    required: true
  },
}, {
  timestamps: true
});

const notificationModel = mongoose.models.Notification || model('Notification', notificationSchema);
export default notificationModel;
