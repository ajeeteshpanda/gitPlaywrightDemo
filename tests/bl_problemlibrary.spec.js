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
    //console.log(token);

    // chapters = await apiContext.get("https://devquestionapi.bytelearn.ai/api/v1/chapters", 
    // {headers: 
    //     {
    //     'Authorization' : token,
    //     //'Content-Type' : 'application/json'
    //     },
    
    // })
    // let str_chapters = JSON.stringify(chapters);
    // console.log(str_chapters);
    // const chaptersJSON = await str_chapters.json();
    // console.log(chaptersJSON);
    // chaptersJSON.str
    // let chapter = await chaptersJSON.percent.topics.name;
    // console.log(chapter);
});


test('teacher dashboard', async function({page})
{
    page.addInitScript(value => 
    {
        window.localStorage.setItem('authToken', value);
    }, token );

    await page.goto("https://dev.bytelearn.ai/teacher/assignment/create");
    await page.waitForLoadState("networkidle");
    const topicNames = page.locator("div.catalog-body div p");
    const topicFilter = page.locator("input[placeholder='Filter by topic']");
    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }

    await topicNames.first().waitFor();
    let topicNumbers = await topicNames.count();
    console.log(topicNumbers);
    const topicNames_list = [];

    for (i=0; i<topicNumbers; i++) {
        topicNames_list[i] = await topicNames.nth(i).textContent();
        //console.log(topicNames_list[i]);
    }
    //console.log(topicNames_list);

        for (i=0; i<topicNumbers; i++) {
        let filtered_topicNames_list = topicNames_list[i].replace(/[\])}[{(]/g, '');
        let topicword = filtered_topicNames_list.split(" ");
        //console.log(topicword);
        let topicword_count = topicword.length;
        //console.log(topicword_count)
        for (j=0; j<topicword_count; j++) 
            {
                
                await topicFilter.fill("");
                await topicFilter.type(topicword[j], {delay: 100});
                sleep(2000);
                //await topicNames.last().waitFor();
                await page.waitForLoadState("networkidle");
                let topicNumbers = await topicNames.count();
                if (topicNumbers ==0){
                console.log(topicword[j]+ ' =' + topicNumbers);
                }
                // for (k=0; k<topicNumbers; k++)
                // {
                // let filteredname = await topicNames.nth(k).textContent();
                //     console.log(filteredname);
                // }
         
        }
            

    // }catch (error)
    // {
    //     console.error('topicword not searchable : '+topicword[j] + error.message)
    // }
}
    

    //console.log(topicNames_list);
    //await page.screenshot({ path: 'screenshot.png', fullPage: true });
});

test.only('chatbot', async function({page})
{
    page.addInitScript(value => 
    {
        window.localStorage.setItem('authToken', value);
    }, token );


    await page.goto("https://dev.bytelearn.ai/student/assignment?assignmentId=40532");
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
    await bubble.click({timeout: 10000});
    const actualQuestion = await problemcount.allInnerTexts();
    //console.log(actualQuestion);

    const studentinputbubble = page.locator("form.chat-interactive");
    const validator = page.locator("div.bubble.bot").last();
    await validator.last().waitFor();
    while(!await page.locator("img.chat-image").isVisible()){
    
        //console.log(await page.locator("img.chat-image").isVisible())
        //console.log(!await page.locator("img.chat-image").isVisible())
    //console.log("Entered while loop : ")
    await page.locator("div.conversations button[type='submit']").waitFor();
    //console.log("check visible");

    const inputtype =  page.locator("div.conversations form.chat-interactive");
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
        await page.locator("button.btn").last().waitFor({state: 'visible', timeout:60000});
        //await page.waitForTimeout(15000);
        //console.log("Exit while loop");

    }
    else if (await inputtype.locator("div.radio-option").last().isVisible())
    {
        console.log("Input type = Radio_Button")
        let inputboxes = await studentinputbubble.locator("div.radio-option").count();
        console.log(inputboxes);
        let expectedinput = await page.locator("div.interactive_expected_input").getAttribute("data-expected_input");
        let expectedinput_json = await JSON.parse(expectedinput);
        let input = (Object.values(expectedinput_json[0]));
        console.log(input[0]);
        for(j=0; j<inputboxes; j++)
        {
            let radiobuttontext = await studentinputbubble.locator("div.radio-option").nth(j).allTextContents();
            console.log(radiobuttontext[0]);
            console.log(radiobuttontext != input)
            if (radiobuttontext[0] = input[0])
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
    else if (await inputtype.locator("div.css-1x8f78m-container").isVisible())
    {
        //console.log("Input type = Dropdown")
        let expectedinput = await page.locator("div.interactive_expected_input").getAttribute("data-expected_input");
        let expectedinput_json = await JSON.parse(expectedinput);
        let input_raw = (Object.values(expectedinput_json[0]));
        //console.log(input_raw[0]);
        let input_string = input_raw[0].toString();
        let input = input_string.toLowerCase();
        await inputtype.locator("div.css-1x8f78m-container").click();
        let inputboxes = await page.locator("div[id*='react-select'] div div").count();
        //console.log(inputboxes);
        for(j=0; j<inputboxes; j++)
        {
            let dropdowntext_raw = await page.locator("div[id*='react-select'] div div").nth(j).allTextContents();
            //console.log(dropdowntext_raw[0]);
            let dropdowntext_string = dropdowntext_raw[0].toString();
            let dropdowntext = dropdowntext_string.toLowerCase();
            //console.log(dropdowntext);
            if (dropdowntext.includes(input))
            {
                await page.locator("div[id*='react-select'] div div").nth(j).click();
                await page.keyboard.press("Enter");
                await page.locator("button.btn").last().waitFor({state: 'visible', timeout:60000});
                //console.log("Exit while loop");
                break;
            }
            //await page.locator("button.bubble.chat-option").last().waitFor({state: 'visible', timeout:15000});
            //await page.waitForTimeout(15000);

        }

    }
    else if (await inputtype.locator("div.drag-area-container").isEditable())
    {
        console.log("Input type = Drardrop")
        let expectedinput = await page.locator("div.interactive_expected_input").getAttribute("data-expected_input");
        let expectedinput_json = await JSON.parse(expectedinput);
        let input_raw = (Object.values(expectedinput_json[0]));
        console.log(input_raw[0]);

        let dragitems = await page.locator("div.dragabble-row.drag-target").count();
        console.log(dragitems);
        for(j=0; j<dragitems; j++)
        {
            let droptarget = page.locator('#draginput-input_1');
            await page.locator("div.dragabble-row.drag-target").nth(j).dragTo(droptarget);
            await page.pause();
            await page.keyboard.press("Enter");
            await page.locator("button.btn").last().waitFor({state: 'visible', timeout:60000});
                //console.log("Exit while loop");

            //await page.locator("button.bubble.chat-option").last().waitFor({state: 'visible', timeout:15000});
            //await page.waitForTimeout(15000);

        }

    }
    else {
        console.log("Input type is not available")
    }

}
    console.log(actualQuestion[0] +" is Complete");
    //await page.locator("div.bot.bubble").first().scrollIntoViewIfNeeded({timeout: 2000});
    await page.locator("div.conversations").screenshot({ path: actualQuestion[0]+'.png' , fullPage: true });
    await page.locator("button.btn:visible").last().click();
}
    catch(e){
    await console.log("error catched");
    await page.locator("button[class*='ChatHeader_button'] span").last().click();
    }
}
});