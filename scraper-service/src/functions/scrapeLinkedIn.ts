import { Browser, BrowserContext, Page } from "puppeteer";
import { JobPosting } from "../models/jobs";
import Config from "../types/configs";

// Jobs to be scraped. From my observation this number varies from 18-25, I don't really know what to do about it
const SCRAPE_AMOUNT = 20;

const LINKEDIN_LOGIN_PAGE = `https://linkedin.com/login`;
const LINKEDIN_LOGIN_BUTTON = `.btn__primary--large.from__button--floating`;

const LINKEDIN_CARD_CLASS = `.job-card-container.relative.job-card-list`;
const LINKEDIN_JOB_TITLE_LINK_CLASS = `.jobs-unified-top-card__job-title`;
const LINKEDIN_JOB_TITLE_CLASS = `.jobs-unified-top-card__job-title`;
const LINKEDIN_JOB_DATE_CLASS = `.jobs-unified-top-card__posted-date`;
const LINKEDIN_JOB_LOCATION_CLASS = `.jobs-unified-top-card__bullet`;
const LINKEDIN_JOB_COMPANY_CLASS = `.ember-view.t-black.t-normal`;

const scrapeLinkedIn = async (browser: Browser, config: Config, linkedInUsername: string, linkedInPassword: string) => {
  
    const context: BrowserContext = await browser.createIncognitoBrowserContext();
    const page: Page = await context.newPage();
    await page.setUserAgent(config.userAgent);

    await page.goto(LINKEDIN_LOGIN_PAGE);

    await page.$eval('input#username', (el: any, linkedInUsername: string) => {
      el.value = linkedInUsername
    }, linkedInUsername);

    await page.$eval('input#password', (el: any, linkedInPassword: string) => {
      el.value = linkedInPassword
    }, linkedInPassword);

    await page.$eval(LINKEDIN_LOGIN_BUTTON, (btn: any) => btn.click());

    await page.waitForNavigation();
    await page.waitForTimeout(1000);
    await page.waitForTimeout(20000);

    for (let i = 0; i < 4; i++) {
      await scrapeLinkedInIter(i, page, config);
    }

    await page.close();
};

const scrapeLinkedInIter = async (jobId: number, page: Page, config: Config) => {
  await page.goto(config.urls.linkedin[jobId]);
  let cards: any[] = await page.$$(LINKEDIN_CARD_CLASS);

  for (let i = 0; i < 18; i++) {
    await page.waitForSelector(LINKEDIN_CARD_CLASS);
    await page.waitForTimeout(1000);
    cards = await page.$$(LINKEDIN_CARD_CLASS);
    
    let index = i;

    if (index >= cards.length)
      index = cards.length - 1;

    await cards[index].click();
    await page.$eval(LINKEDIN_JOB_TITLE_LINK_CLASS, (btn: any) => btn.click());
    
    try {
      await page.waitForSelector(LINKEDIN_JOB_TITLE_CLASS);
      const jobTitleEl: any = await page.$(LINKEDIN_JOB_TITLE_CLASS);
      const jobTitle: string = await jobTitleEl.evaluate((el: any) => el.textContent);

      await page.waitForSelector(LINKEDIN_JOB_DATE_CLASS);
      const jobPostedDateEl: any = await page.$(LINKEDIN_JOB_DATE_CLASS);
      const jobPostedDate: string = (await jobPostedDateEl.evaluate((el: any) => el.textContent)).trim();

      await page.waitForSelector(LINKEDIN_JOB_LOCATION_CLASS);
      const jobLocationEl: any = await page.$(LINKEDIN_JOB_LOCATION_CLASS);
      const jobLocation: string = (await jobLocationEl.evaluate((el: any) => el.textContent)).trim();

      await page.waitForSelector(LINKEDIN_JOB_COMPANY_CLASS);
      const jobCompanyEl: any = await page.$(LINKEDIN_JOB_COMPANY_CLASS);
      const jobCompany: string = (await jobCompanyEl.evaluate((el: any) => el.textContent)).trim();

      const jobSource: string = `LinkedIn`;

      const jobUrl: string = (await page.evaluate(() => document.location.href)).split('?')[0];

      const createdJob = new JobPosting({
        title: jobTitle,
        publicationDate: new Date(),
        location: jobLocation,
        company: jobCompany,
        source: jobSource,
        url: jobUrl,
      });

      await createdJob.save();

    } catch(e: any) {
      if (e.toString().includes(`duplicate key`)) {
        console.log(`Failed to save job: ${e}`);
      } else console.log(e);
    }

    await page.goBack();
  }
};

export default scrapeLinkedIn;