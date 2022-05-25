import Mongoose from 'mongoose';
import mongoose, { Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

export interface AttachmentDocument extends Document {
  name: string;
  url: string;
}

const attachmentSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

attachmentSchema.set('timestamps', true);

attachmentSchema.plugin(uniqueValidator);

interface AttachmentModel extends Mongoose.Model<any> {
  delete(this: Mongoose.Model<any>, attachmentId: string | number): Promise<any>;

  getById(this: Mongoose.Model<any>, attachmentId: string | number): Promise<any>;
}

attachmentSchema.static('delete', async function (this: Mongoose.Model<any>, attachmentId: string | number): Promise<any> {
  return this.deleteOne({ _id: attachmentId });
});

attachmentSchema.static('getById', async function (this: Mongoose.Model<any>, attachmentId: string | number): Promise<AttachmentDocument | null> {
  return this.findOne({ _id: attachmentId });
});

export default mongoose.model<AttachmentDocument, AttachmentModel>('Attachment', attachmentSchema);
