import { model, Schema, Types , mongoose} from 'mongoose';

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
        type: Object,
    },
}, {
    timestamps: true
});

const commentModel = mongoose.models.Comment || model('Comment', commentSchema);
export default commentModel;