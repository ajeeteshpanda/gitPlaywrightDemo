const {test, expect,request} = require('@playwright/test');
const { timeout } = require('../playwright.config');
const loginPayload = {provider: "local", email: "ajeetesh.panda@bytelearn.ai", password: "testing@qa"};
let token;
let chapters;

test.beforeAll( async()=> 
{
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://devuserapi.bytelearn.ai/api/v1/user/login",
    {data: (loginPayload)});

    expect(loginResponse.ok()).toBeTruthy();
    console.log(loginResponse.status())
    const loginResponseJSON = await loginResponse.json();
    token = loginResponseJSON.access_token;

});