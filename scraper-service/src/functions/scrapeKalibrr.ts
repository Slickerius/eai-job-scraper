import { JobPosting } from "../models/jobs";
import Config from "../types/configs";
import { Browser, BrowserContext, Page } from "puppeteer";
const KALIBRR_CARD_CLASS = `.k-grid.k-border-tertiary-ghost-color`;
const KALIBRR_CARD_TITLE_CLASS = `.k-text-primary-color`;
const KALIBRR_CARD_DATE_CLASS = `.k-block.k-mb-1`;
const KALIBRR_CARD_LOCATION_CLASS = `.k-text-subdued.k-block`;
const KALIBRR_CARD_COMPANY_CLASS = `a.k-text-subdued`;

const scrapeKalibrr = async (browser: Browser, config: Config) => {
  console.log(`Scraping job data from Kalibrr . . .`);

  try {
    for (let i = 0; i < config.urls.kalibrr.length; i++) {
      const context: BrowserContext = await browser.createIncognitoBrowserContext();
      const page: Page = await context.newPage();
    
      await page.setUserAgent(config.userAgent);
      scrapeKalibrrJobsIter(i, page, config);
    }
  } catch (e) {
    console.log(`Error while scraping Kalibrr: ${e}`);
  }
};

const scrapeKalibrrJobsIter = async (jobId: number, page: Page, config: Config) => {
  await page.goto(config.urls.kalibrr[jobId]);
  await page.waitForSelector(KALIBRR_CARD_CLASS);

  const cards: any[] = await page.$$(KALIBRR_CARD_CLASS);

  for (let card of cards) {
    await card.waitForSelector(KALIBRR_CARD_TITLE_CLASS);
    const jobTitleEl: any = await card.$(KALIBRR_CARD_TITLE_CLASS);
    const jobTitle: string = await jobTitleEl.evaluate((el: any) => el.textContent);

    const jobPostedDateEl: any = await card.$(KALIBRR_CARD_DATE_CLASS);
    const jobPostedDate: string = (await jobPostedDateEl.evaluate((el: any) => el.textContent))
      .split(`•`)[0]
      .slice(7, -1);

    const jobLocationEl: any = await card.$(KALIBRR_CARD_LOCATION_CLASS);
    const jobLocation: string = await jobLocationEl.evaluate((el: any) => el.textContent);

    const jobCompanyEl: any = await card.$$(KALIBRR_CARD_COMPANY_CLASS);
    const jobCompany: string = await jobCompanyEl[1].evaluate((el: any) => el.textContent);

    const jobSource: string = `Kalibrr`;

    const jobUrl: string = await jobTitleEl.evaluate((el: any) => el.href);

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

export default scrapeKalibrr;
