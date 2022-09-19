const {test, expect,request} = require('@playwright/test');
const loginPayload = {userEmail: "Playwtdemo@yopmail.com", userPassword: "Demo@100"};
const orderPayload = {orders: [{country: "India", productOrderedId: "6262e95ae26b7e1a10e89bf0"}]};
let token;
let orderId;
test.beforeAll( async()=> 
{
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
    {data: loginPayload});

    expect(loginResponse.ok()).toBeTruthy();
    console.log(loginResponse.status())
    const loginResponseJSON = await loginResponse.json();
    token = loginResponseJSON.token;
    console.log(token);

    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", 
    {data: orderPayload,

    headers: 
        {
        'Authorization' : token,
        'Content-Type' : 'application/json'
        },
    
    })

    const orderResponseJSON = await orderResponse.json();
    console.log(orderResponseJSON);
    orderId = orderResponseJSON.orders[0];
    console.log(orderId);
});


test('webAPI test', async function({page})
{
    page.addInitScript(value => 
    {
        window.localStorage.setItem('token', value);
    }, token );

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
        if (id === orderId){
            await orderRows.nth(i).locator("button:has-text('View')").click();
            console.log("Matched with order id: " + id);
            await page.locator("div.address p:has-text('Country')").first().waitFor();
            console.log(await page.locator("div.address p:has-text('Country')").last().textContent());
            break;
        }
    }


});