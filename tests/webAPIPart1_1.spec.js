const {test, expect,request} = require('@playwright/test');
const {APIUtils} = require('./Utils/APIUtils');


const loginPayload = {userEmail: "Playwtdemo@yopmail.com", userPassword: "Demo@100"};
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6262e95ae26b7e1a10e89bf0"}]};

let response;

test.beforeAll( async()=> 
{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);    

});


test('Place an Order', async function({page})
{
    page.addInitScript(value => 
    {
        window.localStorage.setItem('token', value);
    }, response.token );

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.waitForLoadState("networkidle");
  
    //await page.pause();
    
    await page.locator("[routerlink*='myorders']").click();
    
    //const orderId = "62a648e7e26b7e1a10ed8e56";
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