const {test, expect,request} = require('@playwright/test');
const { timeout } = require('../playwright.config');
const loginPayload = {provider: "local", email: "ajeetesh.panda@bytelearn.ai", password: "testing@qa"};
let token;
let chapters;
test.beforeAll( async()=> 
{
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://produserapi.bytelearn.ai/api/v1/user/login",
    {data: (loginPayload)});

    expect(loginResponse.ok()).toBeTruthy();
    //console.log(loginResponse.status())
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


test('SEO Page Validation', async function({page})
{
    page.addInitScript(value => 
    {
        window.localStorage.setItem('authToken', value);
    }, token );

    await page.goto("https://www.bytelearn.com/teacher/dashboard");
    await Promise.all([
        page.waitForNavigation(),
        await page.locator("h3:has-text('Math worksheets')").click()
      ]);

    await Promise.all([
        page.waitForNavigation(),
        await page.locator("div.CourseButtons_btn__15_jY").click()
      ]);

    
    //await page.waitForTimeout(200);
    links = "div.UnitSection_worksheet_link__cNROB a";
    await page.waitForSelector(links,{state:'visible'})
    seoTopics = page.locator(links);
    seoTopics_count = await seoTopics.count();
    console.log(seoTopics_count);

    for (i=0; i<seoTopics_count; i++)
    {
        seoTopicsname = await seoTopics.nth(i).textContent()
        
        
        await Promise.all([
            page.waitForNavigation(),
            await seoTopics.nth(i).click()
          ]);
        validation = await page.locator("h1.next-error-h1").isVisible();
        //console.log(validation);
        if (validation){

            console.log(seoTopicsname +" : BrokenTopicsName");
            await page.goto("https://www.bytelearn.com/math-grade-7");
        // linkelement = page.locator("div.ShortContent_pdf_section__QYu5U a");
        // link = await linkelement.getAttribute("href");
        //     if (link.includes("undefined")){
        //         console.log(seoTopicsname);
        //         //await page.goBack();
        //     }

        // await page.goBack();}
        }
        else {
            linkelement = page.locator("div.ShortContent_pdf_section__QYu5U a");
            link = await linkelement.getAttribute("href");
                if (link.includes("undefined")){
                    console.log(seoTopicsname +" : BrokenLinkName");
                }
                else if (link.includes("null")){
                    console.log(seoTopicsname +" : NullLink");
                }
                
                await page.goBack();
        }
            // console.log(seoTopicsname +" : BrokenTopicsName");
            // await page.goto("https://www.bytelearn.com/math-grade-7");
        }

    }


);