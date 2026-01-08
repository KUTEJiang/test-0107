import { Schema, model, Document, Types } from 'mongoose';

export interface IFile extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadDate: Date;
  uploader?: Types.ObjectId;
  hash: string;
}

const fileSchema = new Schema<IFile>({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  uploader: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  hash: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const File = model<IFile>('File', fileSchema);