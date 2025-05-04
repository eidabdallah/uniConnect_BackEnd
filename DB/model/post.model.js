import { model, Schema, Types } from 'mongoose';
import { mongoose } from 'mongoose';
const postSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
      },
      content: {
        type: String,
      },
      image: {
        type: String,
      },
      likes: [{
        type: Types.ObjectId,
        ref: 'User',
      }],
}, {
    timestamps: true
});

const postModel = mongoose.models.Post || model('Post', postSchema);
export default postModel;