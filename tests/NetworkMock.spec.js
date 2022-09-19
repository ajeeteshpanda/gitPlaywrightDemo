const {test, expect,request} = require('@playwright/test');
const {APIUtils} = require('./Utils/APIUtils');


const loginPayload = {userEmail: "Playwtdemo@yopmail.com", userPassword: "Demo@100"};
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6262e95ae26b7e1a10e89bf0"}]};

let response;
let fakePayloadOrder = {data:[],message:"No Orders"};

test.beforeAll( async()=> 
{
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);    

});


test('Mock Network Response', async function({page})
{
    page.addInitScript(value => 
    {
        window.localStorage.setItem('token', value);
    }, response.token );

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.waitForLoadState("networkidle");
  
    //await page.pause();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/62a796fbe26b7e1a10ed9c6e",
    async route => 
    {
        //Intercepting Response: API Response >> Playwright FakeResponse >> Browser Render Mocked Response
        const response = await page.request.fetch(route.request());
        let body = JSON.stringify(fakePayloadOrder);
        await route.fulfill(
            {
                response,
                body,
            }
        );
    });
    await page.locator("[routerlink*='myorders']").click();
    //await page.pause();
    //const orderId = "62a648e7e26b7e1a10ed8e56";
    await page.locator("button.btn-primary").first().isEnabled();
    let message = await page.locator("div.mt-4").textContent();
    console.log(message);
    //const orderRows = page.locator(".table tbody tr");
    //await orderRows.first().waitFor();
    //const orderCount = await orderRows.count();
    //console.log(orderCount);
    

});

test('Mock Network Request', async function({page})
{
    page.addInitScript(value => 
    {
        window.localStorage.setItem('token', value);
    }, response.token );

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.waitForLoadState("networkidle");
  
    
    await page.locator("[routerlink*='myorders']").click();
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=62e63ec2e26b7e1a10f41c9e",
    async route => route.continue(
        {url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=62e5468be26b7e1a10f3fbd2"}
        ))
    await page.locator("button:has-text('View')").first().click();
    let message = await page.locator("p.blink_me").textContent();
    console.log(message);

});