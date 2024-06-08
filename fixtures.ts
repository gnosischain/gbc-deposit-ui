import { BrowserContext, test as base, chromium } from "@playwright/test";
import { prepareMetamask } from "@synthetixio/synpress/helpers";
import playwright from "@synthetixio/synpress/commands/playwright";

const contextOptions = {
  context: async ({}, use: any) => {
    const metamaskVersion = "11.15.1";
    const metamaskPath = await prepareMetamask(metamaskVersion);

    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      "--remote-debugging-port=9222",
      "--reset-browser-instance-between-tests",
    ];

    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs,
    });
    await playwright.init(context.browser());
    await context.pages()[0].waitForTimeout(5000);
    await use(context);
    await context.close();
  },
};

export const test = base.extend<BrowserContext>(contextOptions);

export const expect = test.expect;