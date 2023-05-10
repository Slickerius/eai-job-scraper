import { JobPosting } from "../models/jobs";
import Config from "../types/configs";

const KALIBRR_CARD_CLASS = `.k-grid.k-border-tertiary-ghost-color`;
const KALIBRR_CARD_TITLE_CLASS = `.k-text-primary-color`;
const KALIBRR_CARD_DATE_CLASS = `.k-block.k-mb-1`;
const KALIBRR_CARD_LOCATION_CLASS = `.k-text-subdued.k-block`;
const KALIBRR_CARD_COMPANY_CLASS = `a.k-text-subdued`;

const scrapeKalibrr = async(browser: any, config: Config) => {
  const context: any = await browser.createIncognitoBrowserContext();
  const page: any = await context.newPage();

  await page.setUserAgent(config.userAgent);
  await scrapeKalibrrJobsIter(0, page, config);
};

const scrapeKalibrrJobsIter = async(jobId: number, page: any, config: Config) => {
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
      publicationDate: new Date(),
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
};

export default scrapeKalibrr;