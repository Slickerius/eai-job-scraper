import * as dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";

import mongoose from "mongoose";
import { JobPosting } from "../lib/JobPosting";
import { DUMMY_JOB } from "../lib/dummy";
import { titleIncluder } from "./titleIncluder";
var cors = require('cors')

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async function (req, res) {
  try {
    const {
      location = [],
      title = [],
      from = "",
      to = new Date().toISOString().split("T")[0],
      company = [],
    } = req.query;
    const locationArr = Array.isArray(location) ? location : [location];
    const titleArr = Array.isArray(title) ? title : [String(title)];
    const companyArr = Array.isArray(company) ? company : [company];
    let or = [];
    let publicationDate: any = {
      $lt: to,
    };
    if (!!from) {
      publicationDate = {
        ...publicationDate,
        $gt: from,
      };
    }
    const optionSansDate = {
      title: {
        $regex: RegExp(titleArr.length == 0 ? "" : titleIncluder(titleArr as string[]).join("|")),
        $options: "i",
      },
      location: { $regex: RegExp(locationArr.length == 0 ? "" : locationArr.join("|")), $options: "i" },
      company: { $regex: RegExp(companyArr.length == 0 ? "" : companyArr.join("|")), $options: "i" },
    };
    console.log(optionSansDate);
    const result = await JobPosting.find({
      $or: [
        {
          ...optionSansDate,
          publicationDate,
        },
        {
          ...optionSansDate,
          publicationDate: {
            $exists: false,
          },
        },
      ],
    });
    res.json(result);
  } catch (err) {
    res.status(500);
    console.error(err);
    res.json({ error: err });
  }
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
  // await JobPosting.deleteMany();
  const promises: Promise<any>[] = DUMMY_JOB.map((job) => {
    const jobposting = JobPosting.build(job);
    return jobposting.save();
  });
  await Promise.all(promises)
    .then((res) => {
      console.log("success menambah dummy data");
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
  app.listen(8000, async () => {
    console.log("Open on 8000");
  });
};
start();
