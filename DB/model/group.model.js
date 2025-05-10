import { model, Schema, Types, mongoose } from 'mongoose';

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: Object,
  },
  ownerId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: Types.ObjectId,
    ref: 'User',
  }],
  type: {
    type: String,
    enum: ['public', 'private'],
    default: 'private',
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
groupSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'groupId',
});
const groupModel = mongoose.models.Group || model('Group', groupSchema);
export default groupModel;
