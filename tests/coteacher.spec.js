const {test, expect,request} = require('@playwright/test');
const { timeout } = require('../playwright.config');
const loginPayload = {provider: "local", email: "ajeetesh.panda@bytelearn.ai", password: "testing@qa"};
let token;
let chapters;



test('chatbot07pc', async function({page})
{
    page.addInitScript(value => 
    {
        window.localStorage.setItem('authToken', value);
    }, token );


    await page.goto("https://dev.bytelearn.ai/student/assignment?assignmentId=41971");
    await page.waitForLoadState("networkidle");
    const problemcount = page.locator("div.problem-statement h2");
    //problemcount.waitFor({state: 'visible'});
    const problemcount_statement = await problemcount.allTextContents();
    //console.log(problemcount_statement);
    const NoOFQuestion_array = problemcount_statement[0].split(" ");
    //console.log(NoOFQuestion_array);
    const LastQuestion = NoOFQuestion_array[NoOFQuestion_array.length-1];
    const FirstQuestion = NoOFQuestion_array[1];
    const NoOFQuestion = LastQuestion-FirstQuestion+1;
    console.log(NoOFQuestion);

    for (z=0; z<NoOFQuestion; z++){
        try{
    const bubble = page.locator("button.bubble");
    await bubble.click({timeout: 60000});
    let actualQuestion = await problemcount.allInnerTexts();
    //console.log(actualQuestion);

    await page.waitForTimeout(10000);
    console.log(actualQuestion[0] +" Screenshot is Taken");
    await page.screenshot({ path: actualQuestion[0]+'.png' , fullPage: true });
    await page.locator("button[class*='ChatHeader_button'] span").last().click();
            }

    catch(e){
        let questionid = page.locator("div.problem-statement span");
        let actualQuestion = await problemcount.allInnerTexts();
        console.log(actualQuestion[0] +" Problem Crashed");
        await page.screenshot({ path: actualQuestion[0]+'.png' , fullPage: true });
        await page.locator("button[class*='ChatHeader_button'] span").last().click();
            }
}
});