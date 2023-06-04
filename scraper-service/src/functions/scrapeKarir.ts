import { JobPosting } from "../models/jobs";
import Config from "../types/configs";
import { Browser, BrowserContext, Page } from "puppeteer";
import convertKarirPostedToDate from "../utils/convertKarirDate";

const KARIR_CARD_CLASS = `.row.opportunity-box`;
const KARIR_CARD_TITLE_CLASS = `.tdd-function-name`;
const KARIR_CARD_DATE_CLASS = `time`;
const KARIR_CARD_LOCATION_CLASS = `.tdd-location`;
const KARIR_CARD_COMPANY_CLASS = `.tdd-company-name`;
const KARIR_PAGE_ERROR_CLASS = "div.search__empty";
const scrapeKarir = async (browser: Browser, config: Config) => {
  console.log(`Scraping job data from Karir.com . . .`);

  try {
    for (let i = 0; i < config.urls.karir.length; i++) {
      const context: BrowserContext = await browser.createIncognitoBrowserContext();
      const page: Page = await context.newPage();

      await page.setUserAgent(config.userAgent);
      await scrapeKarirJobsIter(i, page, config);
    }
  } catch (e) {
    console.log(`Error while scraping Karir.com: ${e}`);
  }
};

const scrapeKarirJobsIter = async (jobId: number, page: Page, config: Config) => {
  let idx = 1;

  while (true) {
    let jobTitle = "";
    let jobUrl = "";
    try {
      const URL = `${config.urls.karir[jobId]}${idx}`;
      console.log(URL);
      await page.goto(URL);

      const isPageNotFound = await page.$(KARIR_PAGE_ERROR_CLASS);
      if (isPageNotFound != null) break;

      await page.waitForSelector(KARIR_CARD_CLASS);

      const cards = await page.$$(KARIR_CARD_CLASS);

      for (let card of cards) {
        await card.waitForSelector(KARIR_CARD_TITLE_CLASS);

        const jobTitleEl = await card.$(KARIR_CARD_TITLE_CLASS);

        jobTitle = await jobTitleEl?.evaluate((el: any) => el.textContent);

        const jobPostedDateEl: any = await card.$(KARIR_CARD_DATE_CLASS);

        const jobPostedDate: string = (await jobPostedDateEl.evaluate((el: any) => el.textContent)).split(`•`)[0];
        const tanggalPost = convertKarirPostedToDate(jobPostedDate);
        const jobLocationEl: any = await card.$(KARIR_CARD_LOCATION_CLASS);

        const jobLocation: string = await jobLocationEl.evaluate((el: any) => el.textContent);

        const jobCompanyEl: any = await card.$(KARIR_CARD_COMPANY_CLASS);

        const jobCompany: string = await jobCompanyEl.evaluate((el: any) => el.textContent);

        const jobSource: string = `Karir.com`;

        const jobUrlEl = await card.$("a.--blue");

        jobUrl = await jobUrlEl?.evaluate((e: any) => e.href);

        const createdJob = new JobPosting({
          title: jobTitle,
          location: jobLocation,
          company: jobCompany,
          source: jobSource,
          url: jobUrl,
          publicationDate: tanggalPost,
        });

        await createdJob.save();
      }
    } catch (err: any) {
      console.error(`${jobTitle} from ${URL}: ${err.message}`);
    }
    if (idx > parseInt(process.env.JOB_SCRAPE_PAGE_LIMIT || "0")) break;
    idx++;
  }

  console.log(`FINISHED SCRAPPING ${config.urls.karir[jobId]}`);

  await page.close();
};

export default scrapeKarir;
