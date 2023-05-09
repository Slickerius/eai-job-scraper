import { Schema, model, connect } from "mongoose";

interface JobPosting {
  title: string;
  publicationDate: string;
  location: string;
  company: string;
  source: string;
  url: string;
}

const userSchema = new Schema<JobPosting>({
  title: { type: String, required: true },
  publicationDate: { type: String, required: true },
  location: { type: String, required: true },
  company: { type: String, required: true },
  url: { type: String, required: true },
});

const User = model<JobPosting>("JobPosting", userSchema);
