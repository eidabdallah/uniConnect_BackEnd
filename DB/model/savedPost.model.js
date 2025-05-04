import { model, Schema, Types , mongoose} from 'mongoose';

const savedPostSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: Types.ObjectId,
    ref: 'Post',
    required: true,
  },
}, {
  timestamps: true
});
savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });
const savedPostModel = mongoose.models.SavedPost || model('SavedPost', savedPostSchema);
export default savedPostModel;
