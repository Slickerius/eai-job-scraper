import cron from "node-cron";
import * as puppeteer from "puppeteer";
import scrapeKalibrr from "./functions/scrapeKalibrr";
import * as dotenv from "dotenv";
import * as fs from "fs";
import Config from "./types/configs";
import scrapeLinkedIn from "./functions/scrapeLinkedIn";
import scrapeKarir from "./functions/scrapeKarir";
import scrapeJobStreet from "./functions/scrapeJobStreet";
dotenv.config();

let browser: puppeteer.Browser | null = null;
const LINKEDIN_PASSWORD = process.env.LINKEDIN_USERNAME as string;
const LINKEDIN_USERNAME = process.env.LINKEDIN_PASSWORD as string;

export const scrapeTask = cron.schedule("0 1 * * *", async () => {
  const config: Config = JSON.parse(fs.readFileSync(`./config.json`).toString());

  browser = await puppeteer.launch({
    headless: true,
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

  await scrapeKarir(browser, config);
  await scrapeKalibrr(browser, config);
  await scrapeJobStreet(browser, config);
  await scrapeLinkedIn(browser, config, LINKEDIN_USERNAME, LINKEDIN_PASSWORD);
});
