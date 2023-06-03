import { JobPosting } from "../models/jobs";
import Config from "../types/configs";
import { Browser, BrowserContext, Page } from "puppeteer";
import convertJobStreetPostedToDate from "../utils/convertJobStreetDate";

const JOBSTREET_CARD_CLASS = `#jobList > div > div:nth-child(2) > div > div > div > div > article > div > div > div`;
const JOBSTREET_CARD_TITLE_CLASS = `div:nth-child(1) > div > h1 > a > div > span`;
const JOBSTREET_CARD_DATE_CLASS = `div > time > span`;
const JOBSTREET_CARD_COMPANY_AND_LOCATION_CLASS = `div:nth-child(1) > div > span > span > a`;
const JOBSTREET_CARD_LINK_CLASS = `div:nth-child(1) > div > h1 > a`;

const scrapeJobStreet = async (browser: Browser, config: Config) => {
  console.log(`Scraping job data from JobStreet . . .`);

  try {
    for (let i = 0; i < config.urls.jobstreet.length; i++) {
      const context: BrowserContext = await browser.createIncognitoBrowserContext();
      const page: Page = await context.newPage();

      await page.setUserAgent(config.userAgent);
      await scrapeJobStreetJobsIter(i, page, config);
    }
  } catch (e) {
    console.log(`Error while scraping JobStreet: ${e}`);
  }
};

const scrapeJobStreetJobsIter = async (jobId: number, page: Page, config: Config) => {
  await page.goto(config.urls.jobstreet[jobId]);
  await page.waitForSelector(JOBSTREET_CARD_CLASS);

  const cards: any[] = (await page.$$(JOBSTREET_CARD_CLASS)).filter((arr, i) => i % 2 === 0);

  for (let card of cards) {
    await card.waitForSelector(JOBSTREET_CARD_TITLE_CLASS);
    const jobTitleEl: any = await card.$(JOBSTREET_CARD_TITLE_CLASS);
    const jobTitle: string = await jobTitleEl.evaluate((el: any) => el.textContent);

    const jobPostedDateEl: any = await card.$(JOBSTREET_CARD_DATE_CLASS);
    const jobPostedDate: string = await jobPostedDateEl.evaluate((el: any) => el.textContent);

    const jobCompanyAndLocationEl: any[] = await card.$$(JOBSTREET_CARD_COMPANY_AND_LOCATION_CLASS);

    const jobCompanyEl: any = jobCompanyAndLocationEl[0];
    const jobCompany: string = jobCompanyAndLocationEl.length > 1 ? await jobCompanyEl.evaluate((el: any) => el.textContent) : 'n/a';

    const jobLocationEl: any =  jobCompanyAndLocationEl.length > 1 ? jobCompanyAndLocationEl[1] : jobCompanyAndLocationEl[0];
    const jobLocation: string = await jobLocationEl.evaluate((el: any) => el.textContent);

    const jobSource: string = `JobStreet`;

    const jobUrlEl: any = await card.$(JOBSTREET_CARD_LINK_CLASS);
    const jobUrl: string = await jobUrlEl.evaluate((el: any) => el.href);

    const createdJob = new JobPosting({
      title: jobTitle,
      location: jobLocation,
      publicationDate: convertJobStreetPostedToDate(jobPostedDate),
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

export default scrapeJobStreet;
