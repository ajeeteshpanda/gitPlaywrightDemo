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

test('chatbot06rp', async function({page})
{
    page.addInitScript(value => 
    {
        window.localStorage.setItem('authToken', value);
    }, token );


    await page.goto("https://dev.bytelearn.ai/student/assignment?assignmentId=43195");
    await page.waitForLoadState("networkidle");
    const problemcount = page.locator("div.problem-statement h2");
    const problemcount_statement = await problemcount.allTextContents();
    const NoOFQuestion_array = problemcount_statement[0].split(" ");
    const LastQuestion = NoOFQuestion_array[NoOFQuestion_array.length-1];
    const FirstQuestion = NoOFQuestion_array[1];
    const NoOFQuestion = LastQuestion-FirstQuestion+1;
    console.log(NoOFQuestion);

    for (z=0; z<NoOFQuestion; z++){
        try{
    const bubble = page.locator("button.bubble");
    await bubble.click({timeout: 120000});
    let actualQuestion = await problemcount.allInnerTexts();
    
    const studentinputbubble = page.locator("form.chat-interactive");
    const validator = page.locator("div.bubble.bot").last();
    await validator.waitFor({state: 'visible'});
    while(!await page.locator("img.chat-image").isVisible()){
    
        //console.log(await page.locator("img.chat-image").isVisible())
        //console.log(!await page.locator("img.chat-image").isVisible())
    //console.log("Entered while loop : ")
    //await page.locator("div.conversations button[type='submit']").waitFor();
    await page.waitForTimeout(5000);
    //console.log("check visible");

    const inputtype =  page.locator("div.conversations form.chat-interactive");
    //console.log(await inputtype.locator("span.mq-root-block").last().isVisible());
    if(await inputtype.locator("span.mq-root-block").last().isVisible())
    {
        //console.log("Input type = Text Box")
        let inputboxes = await studentinputbubble.locator("span.mq-root-block").count();
        //console.log(inputboxes);
        let expectedinput = await page.locator("div.interactive_expected_input").getAttribute("data-expected_input");
        let expectedinput_json = await JSON.parse(expectedinput);
        let input = (Object.values(expectedinput_json[0]));
        //console.log(input[0]);
        for(i=0; i<inputboxes; i++)
        {
            await studentinputbubble.locator("span.mq-root-block").nth(i).click();
            await studentinputbubble.locator("span.mq-root-block").nth(i).type(input[i], {delay:200});
        
        }
        await page.keyboard.press("Enter");
        await page.locator("div.conversations button.btn").last().waitFor({state: 'visible', timeout:60000});
        //await page.waitForTimeout(5000);
        //console.log("Exit while loop");

    }
    
    else if (await inputtype.locator("div.radio-option").last().isVisible())
    {
        //console.log("Input type = Radio_Button")
        let inputboxes = await studentinputbubble.locator("div.radio-option").count();
        //console.log(inputboxes);
        let expectedinput = await page.locator("div.interactive_expected_input").getAttribute("data-expected_input");
        let expectedinput_json = await JSON.parse(expectedinput);
        let input = (Object.values(expectedinput_json[0]));
        //console.log(input[0]);
        for(j=0; j<inputboxes; j++)
        {
            let radiobuttontext = await studentinputbubble.locator("div.radio-option").nth(j).allInnerTexts();
            console.log(radiobuttontext[0]);
            // console.log(radiobuttontext != input)
            if (radiobuttontext[0] == input)
            {
                await studentinputbubble.locator("div.radio-option div").nth(j).click();
                await page.keyboard.press("Enter");
                break;
            }
            await page.locator("button.bubble.chat-option").last().waitFor({state: 'visible', timeout:15000});
            //await page.waitForTimeout(15000);
            console.log("Exit while loop : ");
        }

    }
    else if (await page.locator("div.conversations button.btn").last().isVisible())
    {
        await page.locator("div.conversations button.btn").last().click({timeout: 120000});
        await page.locator("div.conversations button.btn").last().waitFor({state: 'visible', timeout:60000});
    }

}
    //console.log(actualQuestion[0] +" is Complete");
    //await page.locator("div.bot.bubble").first().scrollIntoViewIfNeeded({timeout: 2000});
    await page.screenshot({ path: actualQuestion[0]+'.png' , fullPage: true });
    await page.locator("button.btn:visible").last().click();
}

    catch(e){
        //console.log("error catched");
        let questionid = page.locator("div.problem-statement span");
        let actualQuestion = await problemcount.allInnerTexts();
        console.log(actualQuestion[0] +" Problem Crashed");
        await page.screenshot({ path: actualQuestion[0]+'.png' , fullPage: true });
        await page.locator("button[class*='ChatHeader_button'] span").last().click();
            }
}
});