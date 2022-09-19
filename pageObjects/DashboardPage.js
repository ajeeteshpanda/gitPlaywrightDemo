class DashboardPage {

    constructor(page) 
    {
        this.products = page.locator("div.card-body");
        this.cart = page.locator("[routerlink*='cart']");    
    }


    async searchProduct (productName)
    {
        const products = await this.products;
        const count = await this.products.count();
    
        for(let i=0; i < count; i++) {
    
            //collects the name of the products
            let name = await this.products.locator("b").nth(i).textContent();
            console.log(name);
            
            //check if the name of products is the required product and adds it to the cart
            if (name == productName) {
                //add to cart
                await this.products.locator('i.fa.fa-shopping-cart').nth(i).click();
                break;
            }
            else{
                continue;
            }
        }
    }

    async navigateToCart()
    {
        await this.cart.click();
    }
}
module.exports = {DashboardPage};