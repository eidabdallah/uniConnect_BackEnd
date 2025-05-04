import { model, Schema, Types } from 'mongoose';
import { mongoose } from 'mongoose';
const commentSchema = new Schema({
    postId: {
        type: Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    likes: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    image: {
        type: String,
    },
}, {
    timestamps: true
});

const commentModel = mongoose.models.Comment || model('Comment', commentSchema);
export default commentModel;