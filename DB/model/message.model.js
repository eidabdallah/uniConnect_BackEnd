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
}, {
    timestamps: true
});

const messageModel = mongoose.models.Message || model('Message', messageSchema);
export default messageModel;
