import { BrowserContext, expect, test as baseTest } from "@playwright/test";
import dappwright, { Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";

export const test = baseTest.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({}, use) => {
    // Launch context with extension
    const [wallet, _, context] = await dappwright.bootstrap("", {
      wallet: "metamask",
      version: "11.16.3",
      seed: "test test test test test test test test test test test junk", // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts
      headless: false,
    });

    // Add Hardhat as a custom network
    await wallet.addNetwork({
      networkName: "Hardhat",
      rpc: "http://127.0.0.1:8545",
      chainId: 31337,
      symbol: "ETH",
    });

    await use(context);
  },

  wallet: async ({ context }, use) => {
    const metamask = await dappwright.getWallet("metamask", context);

    await use(metamask);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/connect");
});

test("should be able to connect", async ({ wallet, page }) => {
  await page.click("#metamask");
  await wallet.approve();

  await page.waitForURL("http://localhost:3000/connected?state=deposit");

  const newURL = page.url();
  expect(newURL).toBe("http://localhost:3000/connected?state=deposit");

  const networkText = await page.locator("#network").textContent();
  expect(networkText).toContain("Hardhat");
});
