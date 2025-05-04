import { model, Schema, Types , mongoose} from 'mongoose';


const messageSchema = new Schema({
    senderId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const messageModel = mongoose.models.Message || model('Message', messageSchema);
export default messageModel;
