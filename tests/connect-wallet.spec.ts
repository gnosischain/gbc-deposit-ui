import { BrowserContext, expect, test as baseTest } from "@playwright/test";
import dappwright, { Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";
import fs from "fs";
import path from "path";

export const test = baseTest.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({}, use) => {
    // Launch context with extension
    const [wallet, _, context] = await dappwright.bootstrap("", {
      wallet: "metamask",
      version: "11.16.13",
      seed: "mango choose scrap wasp hill chest process cloud float clarify worth plastic", // Seed phrase for GC Deposit UI only
      headless: true,
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

test.beforeEach(async ({ page, wallet }) => {
  await page.goto("http://localhost:3000/connect");
  await page.click("#metamask");
  await wallet.approve();

  await page.waitForURL("http://localhost:3000/connected?state=deposit");

  await page.waitForFunction(
    () => {
      const networkElement = document.querySelector("#network");
      return networkElement?.textContent && networkElement.textContent.includes("Hardhat");
    },
    null,
    { timeout: 5000 }
  );

  const newURL = page.url();
  expect(newURL).toBe("http://localhost:3000/connected?state=deposit");

  const networkText = await page.locator("#network").textContent();
  expect(networkText).toContain("Hardhat");
});

test.afterEach(async ({ context }) => {
  await context.close();
});

test("should be able to disconnect", async ({ page }) => {
  await page.click("#disconnect");
  await page.waitForURL("http://localhost:3000/");
  const newURL = page.url();
  expect(newURL).toBe("http://localhost:3000/");
});

test("should be able to deposit", async ({ wallet, page }) => {
  const filePath = path.join(__dirname, "..", "data", "deposit_data-1717082979.json");

  if (fs.existsSync(filePath)) {
    console.log("File exists");
  } else {
    console.log("File does not exist");
    throw new Error("File not found");
  }

  const input = page.locator("#dropzone");
  await input.setInputFiles(filePath);
  const filenameText = await page.locator("#filename").textContent();
  expect(filenameText).toContain("deposit_data-1717082979.json");

  await page.click("#deposit");
  await wallet.confirmTransaction();
  
  const confirmationText = await page.locator("#confirmation").textContent();
  expect(confirmationText).toContain("Your transaction is completed ! View it");
});

test("should be able to subscribe autoclaim", async ({ wallet, page }) => {
  await page.click("#withdrawal");
  const autoclaimText = await page.locator("#autoclaim").textContent();
  expect(autoclaimText).toContain("Register");

  await page.click("#autoclaim");
  await wallet.confirmTransaction();
  
  const confirmationText = await page.locator("#confirmation").textContent();
  expect(confirmationText).toContain("Your transaction is completed ! View it");
});

test("should be able to update subscription", async ({ wallet, page }) => {
  await page.click("#withdrawal");
  const autoclaimText = await page.locator("#autoclaim").textContent();
  expect(autoclaimText).toContain("Update");

  await page.click("#autoclaim");
  await wallet.confirmTransaction();
  
  const confirmationText = await page.locator("#confirmation").textContent();
  expect(confirmationText).toContain("Your transaction is completed ! View it");
});

test("should be able to unsubscribe", async ({ wallet, page }) => {
  await page.click("#withdrawal");

  await page.click("#unsubscribe");
  await wallet.confirmTransaction();
  
  const confirmationText = await page.locator("#confirmation").textContent();
  expect(confirmationText).toContain("Your transaction is completed ! View it");
});
