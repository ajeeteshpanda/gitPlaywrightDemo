class LoginPage 
{

    constructor(page) 
    {
        this.page = page;
        this.signInbutton = page.locator("#login");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("[type='password']");
    }

    async goTo()
    {
        await this.page.goto("https://rahulshettyacademy.com/client/");
    }


    async validLogin(userName, password)
    {
        await this.userName.type(userName);
        await this.password.type(password);
        await this.signInbutton.click();
        await this.page.waitForLoadState("networkidle");
    }
}
module.exports = {LoginPage}