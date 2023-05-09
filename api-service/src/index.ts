import * as dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";

import mongoose from "mongoose";
import { JobPosting } from "../lib/model";
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (req, res) {
  const { location = "", title = "", publicationDate = "", company = "" } = req.query;
  const locationArr = Array.isArray(location) ? location : [location];
  await JobPosting.find({
    company:{
        
    }
  });
});

const start = async () => {
  if (!process.env.MONGO_URI) {
    console.log(process.env);
    throw new Error("No MONGO_URI provided!");
  }
  console.log("Connecting to mongodb....");
  await mongoose.connect(process.env.MONGO_URI).catch((err) => {
    console.error(err);
  });
  app.listen(8000, () => {
    console.log("8000");
  });
};
start();
