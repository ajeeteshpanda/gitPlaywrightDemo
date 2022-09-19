const {test} = require('@playwright/test')

test.only("PopUp Validations", async({page})=> 
{
await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

// Event listener
page.on("dialog", async dialog => {
    console.log(dialog.message());
    await dialog.dismiss();
});

await page.locator("#confirmbtn").click();



await page.locator("#mousehover").hover();

const frames = page.frameLocator("#courses-iframe");

// :visible after a locator ensure the locator is visible for performing the action on it
await frames.locator("li a[href='lifetime-access']:visible").click();
// await frames.locator("a:has-Text('All Access plan')").click(); - multiple elements
await page.pause()




})