const {test, expect} = require('@playwright/test');
const {LoginPage} = require('../pageObjects/LoginPage')
const {DashboardPage} = require('../pageObjects/DashboardPage')
const {CheckoutPage} = require('../pageObjects/CheckoutPage')

test('e2e test', async function({browser, page})
{

    const productName = "iphone 13 pro";
    const userName = 'Playwtdemo@yopmail.com';
    const password = 'Demo@100'

    
    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.validLogin(userName, password);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.searchProduct(productName);
    await dashboardPage.navigateToCart();

    await page.waitForLoadState("networkidle");
    await expect(page.locator("div.cartSection h3")).toContainText(productName);
    
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.Checkout();
    await checkoutPage.ShippingCountry("india");
    await checkoutPage.PlaceOrder();

    
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