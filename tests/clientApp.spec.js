const {test, expect} = require('@playwright/test');
//const { expect } = require('../playwright.config');

test('First Playwright test', async function({browser, page})
{
    //code to be added here
    //await - used for JS scipts to wait befoer a step is executes
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

test('Fourth Playwright test', async function({browser, page})
{
    //code to be added here
    //await - used for JS scipts to wait befoer a step is executes
    //const context = await browser.newContext();
    //const newpage = await context.newPage();

    //reusable locators
    const userName = page.locator("#userEmail");
    const signIn = page.locator("#login");
    await page.goto("https://rahulshettyacademy.com/client/");
    
    //css
    await userName.type('anshika@gmail.com');
    await page.locator("[type='password']").type('Iamking@000');
    await signIn.click();
    //await page.pause();


});

test('testbyte', async ({ page }) => {

  // Go to https://dev.bytelearn.ai/
  await page.goto('https://dev.bytelearn.ai/');

  // Click text=👉 Try it for free
  await page.locator('text=👉 Try it for free').click();
  await expect(page).toHaveURL('https://dev.bytelearn.ai/choose-your-account-type?try-step-by-step=true');

  // Click img[alt="teacher emoji"]
  await page.locator('img[alt="teacher emoji"]').click();
  await expect(page).toHaveURL('https://dev.bytelearn.ai/confirm-signup?try-step-by-step=true');

  // Click input[type="text"]
  await page.locator('input[type="text"]').click();

  // Fill input[type="text"]
  await page.locator('input[type="text"]').fill('QA');

  // Click text=Continue
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://dev.bytelearn.ai/student/try-step-by-step' }*/),
    page.locator('text=Continue').click()
  ]);

  // Click text=🐾 Great, let's go step-by-step
  await page.locator('text=🐾 Great, let\'s go step-by-step').click();

  // Click text=Circles
  await page.locator('text=Circles').click();

  // Click text=Take a look at the problem and then we'll go step by step.🚀 Let's go step-by-st >> button
  await page.locator('text=Take a look at the problem and then we\'ll go step by step.🚀 Let\'s go step-by-st >> button').click();

  // Click .mq-root-block >> nth=0
  await page.click('div.conversations span.mq-root-block.mq-empty');

  // Fill text=Fraction of the circle ​Check >> textarea
  await page.type("input[name='step_1_input']", '3/4');

  // Click span:has-text("34​​") >> nth=2
  //await page.locator('span:has-text("34​​")').nth(2).click();

  // Press Enter
  await page.locator('text=Fraction of the circle 34​​Check >> textarea').press('Enter');

  // Click text=Line segment UV Choose...Check >> svg >> nth=1
  await page.locator('text=Line segment UV Choose...Check >> svg').nth(1).click();

  // Click #react-select-2-option-1
  await page.locator('#react-select-2-option-1').click();

  // Click text=Check
  await page.locator('text=Check').click();

});

test('e2e test', async function({browser, page})
{
    //code to be added here
    //await - used for JS scipts to wait befoer a step is executes
    //const context = await browser.newContext();
    //const newpage = await context.newPage();
    const reqname = "zara coat 3";
    const email = 'Playwtdemo@yopmail.com';
    //reusable locators
    const userName = page.locator("#userEmail");
    const signIn = page.locator("#login");
    await page.goto("https://rahulshettyacademy.com/client/");
    
    //css
    await userName.type(email);
    await page.locator("[type='password']").type('Demo@100');
    await signIn.click();
    //await page.pause();
    await page.waitForLoadState("networkidle");
    const products = page.locator("div.card-body");
    const count = await products.count();

    for(let i=0; i < count; i++) {

        //collects the name of the products
        name = await products.locator("b").nth(i).textContent();
        console.log(name);
        
        //check if the name of products is the required product and adds it to the cart
        if (name == reqname) {
            //add to cart
            await products.locator('i.fa.fa-shopping-cart').nth(i).click();
        }
        else{
            continue;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    //await page.locator("div li").first().waitFor();
    await page.waitForLoadState("networkidle");
    //cartName = await page.locator("div.cartSection h3").textContent();
    await expect(page.locator("div.cartSection h3")).toContainText(reqname);
    //console.log(cartName);

    await page.locator("button:has-text('Checkout')").click();
    await page.locator("input[placeholder*='Country']").type("indi", {delay: 100});
    //await page.waitForTimeout(5000);
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    optionsCount = await dropdown.locator("button").count();
    for(let i=0; i < optionsCount; i++) {
        text = await dropdown.locator("button").nth(i).textContent();
        if(text === " India"){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    //await page.pause()
    //await page.locator("input[class='input txt']").first().type("676");
    //await expect(page.locator(".user__name input[type='text']")).toHaveText(email);
    await page.locator("a.action__submit").click();
    
    const fullOrderID = await page.locator("label.ng-star-inserted").textContent();

    const orderId = fullOrderID.split(" ")[2];
    console.log(orderId);

    await page.locator("[routerlink*='myorders']").first().click();

    const orderRows = page.locator(".table tbody tr");
    await orderRows.first().waitFor();
    const orderCount = await orderRows.count();
    console.log(orderCount);

    for (let i = 0; i < orderCount; i++)
    {
        
        let id = await orderRows.locator("th").nth(i).textContent();
        console.log(id)
        if (id === orderId){
            await orderRows.nth(i).locator("button:has-text('View')").click();
            console.log("Matched with order id: " + id);
            break;
        }
    }


});

test.only('Amazon ss', async function({browser, page})
{
    //code to be added here
    //await - used for JS scipts to wait befoer a step is executes
    const context = await browser.newContext();
    const newpage = await context.newPage();
    await page.goto("https://amazon.in");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: 'actualQuestion.png' , fullPage: true });



});