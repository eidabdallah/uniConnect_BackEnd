import { model, Schema, Types, mongoose } from 'mongoose';
const postSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
  },
  image: [{
    type: Object,
  }],
  visibility: {
    type: String,
    enum: ['public', 'friends-only'],
    default: 'public'
  },
  likes: [{
    type: Types.ObjectId,
    ref: 'User',
  }],
  groupId: {
    type: Types.ObjectId,
    ref: 'Group',
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
});
const postModel = mongoose.models.Post || model('Post', postSchema);
export default postModel;