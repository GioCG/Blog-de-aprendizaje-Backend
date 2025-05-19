import { Schema, model } from "mongoose";

const CommitSchema = new Schema({
  textoprincipal: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: Boolean, default: true },
  parentCommit: { type: Schema.Types.ObjectId, ref: 'Commit', default: null }
}, {
  timestamps: true,
  versionKey: false
});

CommitSchema.virtual('childCommits', {
  ref: 'Commit',
  localField: '_id',
  foreignField: 'parentCommit'
});

CommitSchema.set('toObject', { virtuals: true });
CommitSchema.set('toJSON', { virtuals: true });

export default model('Commit', CommitSchema);
