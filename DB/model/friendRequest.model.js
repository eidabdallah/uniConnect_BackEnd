import { model, Schema, Types , mongoose} from 'mongoose';

const friendRequestSchema = new Schema({
    senderId: { type: Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
}, {
    timestamps: true
});

const friendRequestModel = mongoose.models.FriendRequest || model('FriendRequest', friendRequestSchema);
export default friendRequestModel;