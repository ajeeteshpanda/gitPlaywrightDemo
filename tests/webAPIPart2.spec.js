const {test, expect,request} = require('@playwright/test');
const {APIUtils} = require('./Utils/APIUtils');

let webContext;

test.beforeAll( async({browser})=> 
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const email = 'Playwtdemo@yopmail.com';
    const userName = page.locator("#userEmail");
    const signIn = page.locator("#login");
    await page.goto("https://rahulshettyacademy.com/client/");
    
    //css
    await userName.type(email);
    await page.locator("[type='password']").type('Demo@100');
    await signIn.click();
    //await page.pause();
    await page.waitForLoadState("networkidle");
    await context.storageState({path: 'state.json'});

    webContext = await browser.newContext({storageState: 'state.json'});
});


test('Place an Order', async function()
{
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client/");
    await page.waitForLoadState("networkidle");

    await page.locator("[routerlink*='myorders']").click();
    
    const orderRows = page.locator(".table tbody tr");
    await orderRows.first().waitFor();
    const orderCount = await orderRows.count();
    console.log(orderCount);

    for (let i = 0; i < orderCount; i++)
    {
        
        let id = await orderRows.locator("th").nth(i).textContent();
        console.log(id)
        if (id === response.orderId){
            await orderRows.nth(i).locator("button:has-text('View')").click();
            console.log("Matched with order id: " + id);
            await page.locator("div.address p:has-text('Country')").first().waitFor();
            console.log(await page.locator("div.address p:has-text('Country')").last().textContent());
            break;
        }
    }


});