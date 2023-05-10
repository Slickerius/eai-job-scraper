import mongoose from "mongoose";

interface JobPostingAttributes {
  _id: string;
  title: string;
  publicationDate: string;
  location: string;
  company: string;
  source: string;
  url: string;
}

interface JobPostingDoc extends mongoose.Document {
  title: string;
  publicationDate: string;
  location: string;
  company: string;
  source: string;
  url: string;
}
interface JobPostingModel extends mongoose.Model<JobPostingDoc> {
  build(attrs: JobPostingAttributes): JobPostingDoc;
}

const JobPostingSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    order_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const JobPosting = mongoose.model<JobPostingDoc, JobPostingModel>(
  "JobPosting",
  JobPostingSchema
);

export { JobPosting };