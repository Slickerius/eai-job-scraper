import { JobPosting } from "../models/jobs";
import Config from "../types/configs";
import { Browser, BrowserContext, Page } from "puppeteer";

const KARIR_CARD_CLASS = `.row.opportunity-box`;
const KARIR_CARD_TITLE_CLASS = `.tdd-function-name`;
const KARIR_CARD_DATE_CLASS = `time`;
const KARIR_CARD_LOCATION_CLASS = `.tdd-location`;
const KARIR_CARD_COMPANY_CLASS = `.tdd-company-name`;

const scrapeKarir = async (browser: Browser, config: Config) => {
  for (let i = 0; i < 4; i++) {
    const context: BrowserContext = await browser.createIncognitoBrowserContext();
    const page: Page = await context.newPage();

    await page.setUserAgent(config.userAgent);
    await scrapeKarirJobsIter(i, page, config);
  }
};

const scrapeKarirJobsIter = async (jobId: number, page: Page, config: Config) => {
  console.log("Scrapping :" + config.urls.karir[jobId]);
  await page.goto(config.urls.karir[jobId]);

  await page.waitForSelector(KARIR_CARD_CLASS);

  const cards = await page.$$(KARIR_CARD_CLASS);

  for (let card of cards) {
    await card.waitForSelector(KARIR_CARD_TITLE_CLASS);

    const jobTitleEl = await card.$(KARIR_CARD_TITLE_CLASS);

    const jobTitle: string = await jobTitleEl?.evaluate((el: any) => el.textContent);

    const jobPostedDateEl: any = await card.$(KARIR_CARD_DATE_CLASS);

    const jobPostedDate: string = (await jobPostedDateEl.evaluate((el: any) => el.textContent))
      .split(`•`)[0]
      .slice(7, -1);

    const jobLocationEl: any = await card.$(KARIR_CARD_LOCATION_CLASS);

    const jobLocation: string = await jobLocationEl.evaluate((el: any) => el.textContent);

    const jobCompanyEl: any = await card.$(KARIR_CARD_COMPANY_CLASS);

    const jobCompany: string = await jobCompanyEl.evaluate((el: any) => el.textContent);

    const jobSource: string = `KARIR`;

    const jobUrlEl = await card.$("a.--blue");

    const jobUrl: string = await jobUrlEl?.evaluate((e: any) => e.href);

    const createdJob = new JobPosting({
      title: jobTitle,
      location: jobLocation,
      company: jobCompany,
      source: jobSource,
      url: jobUrl,
    });

    try {
      await createdJob.save();
    } catch (err) {
      console.error(`Failed to save job: ${err}`);
    }
  }

  await page.close();
};

export default scrapeKarir;
