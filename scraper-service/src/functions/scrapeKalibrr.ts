import { JobPosting } from "../models/jobs";
import Config from "../types/configs";
import { Browser, BrowserContext, Page } from "puppeteer";
import convertKalibrPostedToDate from "../utils/convertKalibrDate";
const KALIBRR_CARD_CLASS = `.k-grid.k-border-tertiary-ghost-color`;
const KALIBRR_CARD_TITLE_CLASS = `.k-text-primary-color`;
const KALIBRR_CARD_DATE_CLASS = `.k-block.k-mb-1`;
const KALIBRR_CARD_LOCATION_CLASS = `.k-text-subdued.k-block`;
const KALIBRR_CARD_COMPANY_CLASS = `a.k-text-subdued`;
const KALIBRR_PAGE_ERROR_CLASS = `.k-font-bold.k-text-lg`;

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
  let idx: number = 1;

  while (true) {
    const URL = `${config.urls.kalibrr[jobId]}${idx}`;
    console.log(URL);
    await page.goto(URL);
    await page.waitForSelector(KALIBRR_CARD_CLASS);
    const isPageNotFound = await page.$(KALIBRR_PAGE_ERROR_CLASS);
    if (isPageNotFound != null) {
      const errtext = await isPageNotFound.evaluate((el) => el.textContent);
      console.log(errtext);
      if (errtext?.startsWith("Oops!")) {
        break;
      }
    }

    const cards: any[] = await page.$$(KALIBRR_CARD_CLASS);

    for (let card of cards) {
      let jobTitle = "";
      let jobUrl = "";
      try {
        await card.waitForSelector(KALIBRR_CARD_TITLE_CLASS);
        const jobTitleEl: any = await card.$(KALIBRR_CARD_TITLE_CLASS);
        jobTitle = await jobTitleEl.evaluate((el: any) => el.textContent);

        const jobPostedDateEl: any = await card.$(KALIBRR_CARD_DATE_CLASS);
        const jobPostedDate: string = (await jobPostedDateEl.evaluate((el: any) => el.textContent)).split(`•`)[0];
        jobUrl = await jobTitleEl.evaluate((el: any) => el.href);

        const tanggalPost = convertKalibrPostedToDate(jobPostedDate.trim());

        const jobLocationEl: any = await card.$(KALIBRR_CARD_LOCATION_CLASS);
        const jobLocation: string = await jobLocationEl.evaluate((el: any) => el.textContent);

        const jobCompanyEl: any = await card.$$(KALIBRR_CARD_COMPANY_CLASS);
        const jobCompany: string = await jobCompanyEl[1].evaluate((el: any) => el.textContent);

        const jobSource: string = `Kalibrr`;

        const createdJob = new JobPosting({
          title: jobTitle,
          location: jobLocation,
          company: jobCompany,
          source: jobSource,
          url: jobUrl,
          publicationDate: !tanggalPost ? undefined : tanggalPost,
        });
        await createdJob.save().catch(()=>{})
      } catch (err: any) {
        // console.error(`${jobTitle} from ${URL}: ${err.message}`);
      }
    }

    if (idx > parseInt(process.env.JOB_SCRAPE_PAGE_LIMIT || "0")) break;
    idx++;
  }
  console.log(`FINISHED SCRAPPING ${config.urls.kalibrr[jobId]}`)
  await page.close();
};

export default scrapeKalibrr;
