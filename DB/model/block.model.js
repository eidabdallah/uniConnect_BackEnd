import { model, Schema, Types, mongoose } from 'mongoose';

const blockUserSchema = new Schema({
  blockerId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  blockedId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

blockUserSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

const blockUserModel = mongoose.models.BlockUser || model('BlockUser', blockUserSchema);
export default blockUserModel;
