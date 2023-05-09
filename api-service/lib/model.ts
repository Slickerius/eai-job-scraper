import { Schema, model, connect } from "mongoose";

interface IJobPosting {
  title: string;
  publicationDate: string;
  location: string;
  company: string;
  source: string;
  url: string;
}

const userSchema = new Schema<IJobPosting>({
  title: { type: String, required: true },
  publicationDate: { type: String, required: true },
  location: { type: String, required: true },
  company: { type: String, required: true },
  url: { type: String, required: true },
});

const JobPosting = model<IJobPosting>("JobPosting", userSchema);

export { JobPosting };
