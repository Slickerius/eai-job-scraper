import * as puppeteer from "puppeteer";
import scrapeKalibrr from "./functions/scrapeKalibrr";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as fs from "fs";
import Config from "./types/configs";
import scrapeLinkedIn from "./functions/scrapeLinkedIn";
import { JobPosting } from "./models/jobs";
import scrapeKarir from "./functions/scrapeKarir";

dotenv.config();

let browser: puppeteer.Browser | null = null;

const init = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error(`No MONGO_URI provided!`);
  }

  console.log(`Connecting to mongodb....`);
  await mongoose.connect(process.env.MONGO_URI).catch((err) => {
    console.error(err);
  });

  await JobPosting.deleteMany();

  console.log("Successfully connected");

  const config: Config = JSON.parse(fs.readFileSync(`./config.json`).toString());

  browser = await puppeteer.launch({
    headless: false,
    executablePath: process.env.CHROME_BIN || undefined,
    args: [
      `--no-sandbox`,
      `--disable-gpu`,
      `--disable-dev-shm-usage`,
      `--user-agent=${config.userAgent}`,
      `--user-data-dir=/tmp/user_data/`,
      `--start-maximized`,
    ],
  });

  scrape(browser, config);
};

const scrape = async (browser: puppeteer.Browser, config: Config) => {
  // scrapeLinkedIn(browser, config, process.env.LINKEDIN_USERNAME as string, process.env.LINKEDIN_PASSWORD as string);
  scrapeKarir(browser, config);
};

init();
