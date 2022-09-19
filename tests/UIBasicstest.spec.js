const {test, expect} = require('@playwright/test');
//const { expect } = require('../playwright.config');

test('First Playwright test', async function({browser, page})
{
    //code to be added here
    //await - used for JS scipts to wait befoer a step executes
    const context = await browser.newContext();
    const newpage = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    //css
    await page.locator("#username").type('rahulshetty');
    await page.locator("[type='password']").type('learning');
    await page.locator("#signInBtn").click();
    //webdriver wait in Selenium - here it is autowait
    console.log(await page.locator("[style*='block']").textContent());
    //expect assertions
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');


});

test('Second Playwright test', async function({page})
{
    
    await page.goto("https://google.com/");
    //get title & assertions
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");

});

test('Third Playwright test', async function({browser, page})
{
    //code to be added here
    //await - used for JS scipts to wait befoer a step is executes
    //const context = await browser.newContext();
    //const newpage = await context.newPage();

    //reusable locators
    const userName = page.locator("#username");
    const signIn = page.locator("#signInBtn");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    
    //css
    await userName.type('rahulshetty');
    await page.locator("[type='password']").type('learning');
    await signIn.click();
    //webdriver wait in Selenium - here it is autowait
    
    console.log(await page.locator("[style*='block']").textContent());
    
    //expect assertions
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();
    console.log(await page.locator(".card-body a").first().textContent());
    console.log(await page.locator(".card-body a").first());
    await expect(page.locator("//a[contains(text(),'iphone X')]")).toContainText("iphone");


});