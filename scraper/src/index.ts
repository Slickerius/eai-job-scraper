import * as puppeteer from 'puppeteer';
import scrapeKalibrr from './functions/scrapeKalibrr';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import Config from './types/configs';

dotenv.config();

let browser: any = null;

const init = (async() => {
  if (!process.env.MONGO_URI) {
    throw new Error(`No MONGO_URI provided!`);
  }

  console.log(`Connecting to mongodb....`);
  await mongoose.connect(process.env.MONGO_URI).catch((err) => {
    console.error(err);
  });

  browser = await puppeteer.launch({ headless: false,
            executablePath: process.env.CHROME_BIN || undefined,
            args: [`--no-sandbox`, `--disable-gpu`, `--disable-dev-shm-usage`, 
            `--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36`,
            `--user-data-dir=/tmp/user_data/`,
            `--start-maximized`] });
  
  const config: Config = JSON.parse(fs.readFileSync(`./config.json`).toString());
  scrape(browser, config);
});

const scrape = (async(browser: any, config: Config) => {
  scrapeKalibrr(browser, config);
});

init();