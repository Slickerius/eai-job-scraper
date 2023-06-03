import { Browser, BrowserContext, Page } from "puppeteer";
import { JobPosting } from "../models/jobs";
import Config from "../types/configs";
import convertLinkedInPostedToDate from "../utils/convertLinkedInDate";
import * as dotenv from "dotenv";

dotenv.config();

// Jobs to be scraped. From my observation this number varies from 18-25, I don't really know what to do about it
const SCRAPE_AMOUNT = 18;

const LINKEDIN_LOGIN_PAGE = `https://linkedin.com/login`;
const LINKEDIN_LOGIN_BUTTON = `.btn__primary--large.from__button--floating`;

const LINKEDIN_CARD_CLASS = `.job-card-container.relative.job-card-list`;
const LINKEDIN_JOB_TITLE_LINK_CLASS = `.jobs-unified-top-card__job-title`;
const LINKEDIN_JOB_TITLE_CLASS = `.jobs-unified-top-card__job-title`;
const LINKEDIN_JOB_DATE_CLASS = `.jobs-unified-top-card__posted-date`;
const LINKEDIN_JOB_LOCATION_CLASS = `.jobs-unified-top-card__bullet`;
const LINKEDIN_JOB_COMPANY_CLASS = `body > div.application-outlet > div.authentication-outlet > div > div.job-view-layout.jobs-details > div.grid > div > div:nth-child(1) > div > div > div.p5 > div.jobs-unified-top-card__primary-description > span.jobs-unified-top-card__subtitle-primary-grouping.t-black > span.jobs-unified-top-card__company-name`;

const LINKEDIN_PAGE_ERROR_CLASS = `body > div.application-outlet > div.authentication-outlet > div.scaffold-layout.scaffold-layout--breakpoint-md.scaffold-layout--list-detail.scaffold-layout--reflow.scaffold-layout--has-list-detail.jobs-search-two-pane__layout > div > div.scaffold-layout__row.scaffold-layout__header > div > h1`;

const scrapeLinkedIn = async (browser: Browser, config: Config, linkedInUsername: string, linkedInPassword: string) => {
    console.log(`Scraping job data from LinkedIn . . .`);

    const context: BrowserContext = await browser.createIncognitoBrowserContext();
    const page: Page = await context.newPage();
    await page.setUserAgent(config.userAgent);

    try {
      await page.goto(LINKEDIN_LOGIN_PAGE);

      await page.$eval('input#username', (el: any, linkedInUsername: string) => {
        el.value = linkedInUsername
      }, linkedInUsername);

      await page.$eval('input#password', (el: any, linkedInPassword: string) => {
        el.value = linkedInPassword
      }, linkedInPassword);

      await page.$eval(LINKEDIN_LOGIN_BUTTON, (btn: any) => btn.click());

      await page.waitForNavigation();
      await page.waitForTimeout(2500);

      for (let i = 0; i < config.urls.linkedin.length; i++) {
        await scrapeLinkedInIter(i, page, config);
      }
    } catch (e) {
      console.log(`Error while scraping LinkedIn: ${e}`);
    }

    await page.close();
};

const scrapeLinkedInIter = async (jobId: number, page: Page, config: Config) => {
  let idx: number = 0;
  while (true) {
    console.log(`Scraping LinkedIn ${jobId} on page ${idx + 1} . . .`);

    await page.goto(`${config.urls.linkedin[jobId]}${idx * 25}`);
    const isPageNotFound = (await page.$(LINKEDIN_PAGE_ERROR_CLASS)) || "";;

    console.log(isPageNotFound);

    if (isPageNotFound)
      break;

    let cards: any[] = await page.$$(LINKEDIN_CARD_CLASS);
    
    for (let i = 0; i < SCRAPE_AMOUNT; i++) {
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
      
        await page.waitForSelector(LINKEDIN_JOB_COMPANY_CLASS, { timeout: 7500 });
        const jobCompanyEl: any = await page.$(LINKEDIN_JOB_COMPANY_CLASS);
        const jobCompany: string = (await jobCompanyEl.evaluate((el: any) => el.textContent)).trim();
      
        const jobSource: string = `LinkedIn`;
      
        const jobUrl: string = (await page.evaluate(() => document.location.href)).split('?')[0];
      
        const createdJob = new JobPosting({
          title: jobTitle,
          publicationDate: convertLinkedInPostedToDate(jobPostedDate),
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

    idx++;

    if (idx == parseInt(process.env.JOB_SCRAPE_PAGE_LIMIT || '0'))
      break;
  }
};

export default scrapeLinkedIn;