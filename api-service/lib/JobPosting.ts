import mongoose from "mongoose";

interface JobPostingAttributes {
  title: string;
  publicationDate: Date;
  location: string;
  company: string;
  source: string;
  url: string;
}

interface JobPostingDoc extends mongoose.Document {
  title: string;
  publicationDate: Date;
  location: string;
  company: string;
  source: string;
  url: string;
}
interface JobPostingModel extends mongoose.Model<JobPostingDoc> {}

const JobPostingSchema = new mongoose.Schema<JobPostingDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    publicationDate: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
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

const JobPosting = mongoose.model<JobPostingDoc, JobPostingModel>("JobPosting", JobPostingSchema);

export { JobPosting };
