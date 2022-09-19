class CheckoutPage {

    constructor(page) 
    {
        this.page = page;
        this.CheckoutButton = page.locator("button:has-text('Checkout')");
        this.ShipCountry = page.locator("input[placeholder*='Country']");
        this.PlaceOrderButton = page.locator("a.action__submit");
    }

    async Checkout ()
    {
        await this.CheckoutButton.click();
    }

    async ShippingCountry (country)
    {
        await this.ShipCountry.type(country, {delay: 100});
        const dropdown = this.page.locator(".ta-results");
        await dropdown.waitFor();
        let optionsCount = await dropdown.locator("button").count();
        for(let i=0; i < optionsCount; i++)
        {
            let text = await dropdown.locator("button").nth(i).textContent();
                if(text === " India")
                {
                await dropdown.locator("button").nth(i).click();
                break;
                 }
        }
    }
    async PlaceOrder ()
    {
        await this.PlaceOrderButton.click();
    }
}
module.exports = {CheckoutPage};