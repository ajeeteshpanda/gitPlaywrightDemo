const { test, expect, request } = require("@playwright/test");
const { timeout } = require("../playwright.config");
const loginPayload = {
  provider: "local",
  email: "ajeetesh.panda@bytelearn.ai",
  password: "testing@qa",
};
let token;
let chapters;
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(
    "https://devuserapi.bytelearn.ai/api/v1/user/login",
    { data: loginPayload }
  );

  expect(loginResponse.ok()).toBeTruthy();
  console.log(loginResponse.status());
  const loginResponseJSON = await loginResponse.json();
  token = loginResponseJSON.access_token;
});

test("chatbot", async function ({ page }) {
  page.addInitScript((value) => {
    window.localStorage.setItem("authToken", value);
  }, token);

  await page.goto(
    "https://dev.bytelearn.ai/student/assignment?assignmentId=43982"
  );
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(5000);
  const problemcount = page.locator("div.problem-statement h2");
  const problemcount_statement = await problemcount.allTextContents();
  const NoOFQuestion_array = problemcount_statement[0].split(" ");
  const LastQuestion = NoOFQuestion_array[NoOFQuestion_array.length - 1];
  const FirstQuestion = NoOFQuestion_array[1];
  const NoOFQuestion = LastQuestion - FirstQuestion + 1;
  console.log(NoOFQuestion);

  for (z = 0; z < NoOFQuestion; z++) {
    const stick_bottom = page.locator("div.conversations div.stick-bottom");
    const bubble = page.locator("button.bubble");
    await bubble.click({ timeout: 120000 });
    let actualQuestion = await problemcount.allInnerTexts();

    const studentinputbubble = page.locator("div.conversations div.stick-bottom form.chat-interactive");
    await stick_bottom.waitFor({timeout:120000});

    while (!(await page.locator("img.chat-image").isVisible())) {
      
      const numberOfInputs = studentinputbubble.locator("div.test_interactive");
      const numberOfInputs_count = await numberOfInputs.count();
      console.log(numberOfInputs_count);
      console.log("while loop");
      let expected_answer;

      for (let i=0; i<numberOfInputs_count; i++)
      {
        console.log("For "+i)
        let studentinputtype = await numberOfInputs.nth(i).getAttribute("class");
        console.log(studentinputtype);
        //await numberOfInputs.nth(i).click();

        if (studentinputtype.includes("test_input")) {
            let inputboxes = await studentinputbubble
              .locator("span.mq-root-block")
            let expectedinput = await page
              .locator("div.interactive_expected_input")
              .getAttribute("data-expected_input");
            let answerkey = await studentinputbubble
              .locator("div.test_input input[type='hidden']")
              .getAttribute("name");
            let expectedinput_json = await JSON.parse(expectedinput);
            let expected_answer = expectedinput_json[0][answerkey];
            let input = Object.values(expectedinput_json[0]);  
            await numberOfInputs.nth(i).click();
              let filtered_input = await input[i].replace(/[\])}[{(]/g, "");
              await numberOfInputs.nth(i).type(expected_answer, { delay: 200 });//earlier filtered_input was used
              //await page.keyboard.press('Tab');
              await problemcount.click();
          }
        else if (studentinputtype.includes("test_dropdown")) {
                let expectedinput = await page.locator("div.interactive_expected_input").getAttribute("data-expected_input");
                let expectedinput_json = await JSON.parse(expectedinput);
                console.log(expectedinput_json);
                let input_raw = (Object.values(expectedinput_json[0]));
                let input_string = input_raw[0].toString();
                let input = input_string.toLowerCase();
                //console.log(input);
                let newinput;
                let answerkey;
                let new_expected_answer

                if (input == "/"){
                    newinput = "divide by"
                }
                if (await numberOfInputs.nth(i).locator("div.css-tvfyyr-container").isVisible()){
                    await studentinputbubble.locator("div.css-tvfyyr-container").click();
                    answerkey = await studentinputbubble
                    .locator("div.css-tvfyyr-container input[type='hidden']")
                  .getAttribute("name");
                }
                else if (await numberOfInputs.nth(i).locator("div.css-9ru2rz-container").isVisible()){
                    await studentinputbubble.locator("div.css-9ru2rz-container").click();
                    answerkey = await studentinputbubble
                  .locator("div.css-9ru2rz-container input[type='hidden']")
                  .getAttribute("name");
                }
                else if (await numberOfInputs.nth(i).locator("div.css-fndec8-container").isVisible()){
                    await studentinputbubble.locator("div.css-fndec8-container").click();
                    answerkey = await studentinputbubble
                    .locator("div.css-fndec8-container input[type='hidden']")
                    .getAttribute("name");
                }
                else if (await numberOfInputs.nth(i).locator("div.css-1gvdc9a-container").isVisible()){
                  await studentinputbubble.locator("div.css-1gvdc9a-container").click();
                  answerkey = await studentinputbubble
                  .locator("div.css-1gvdc9a-container input[type='hidden']")
                  .getAttribute("name");
              }
                console.log(answerkey);
                expected_answer = expectedinput_json[0][answerkey];
                if (expected_answer == "-"){
                  expected_answer = "subtract"
                }
              else if (expected_answer == "/"){
                expected_answer = "divide by"
            }
            else if (expected_answer == "*"){
              expected_answer = "multiply by"
          }
          else if (expected_answer == "+"){
            expected_answer = "add"
        }
              else if (expected_answer == ">="){
                expected_answer = "≥"
            }
            else if (expected_answer == "<="){
              expected_answer = "≤"
          }
                let inputboxes = await page.locator("div[id*='react-select'] div div").count();
                console.log(inputboxes);
                for(j=0; j<inputboxes; j++)
                {
                    let dropdowntext_raw = await page.locator("div[id*='react-select'] div div").nth(j).allTextContents();
                    let dropdowntext_string = dropdowntext_raw[0].toString();
                    let dropdowntext = dropdowntext_string.toLowerCase();
                    console.log(dropdowntext);
                    console.log(expected_answer);
                    if (dropdowntext == expected_answer)//input used earleir
                    {
                        await page.waitForTimeout(1000);
                        await page.locator("div[id*='react-select'] div div").nth(j).click();
                        break;
                    }        
                }
            }   
      }
      console.log("for loop over");
      await studentinputbubble.locator('button', { hasText: 'Check' }).click();
      //await page.keyboard.press('Enter');
      await page.locator("button.btn").last().waitFor({state: 'visible', timeout:60000});
       
        

    }
    await page.screenshot({ path: actualQuestion[0] + ".png", fullPage: true });
    await page.locator("button.btn:visible").last().click();

    // catch(e)
    // {
    //     let questionid = page.locator("div.problem-statement span");
    //     let actualQuestion = await problemcount.allInnerTexts();
    //     console.log(actualQuestion[0] +" Problem Crashed");
    //     await page.screenshot({ path: actualQuestion[0]+'.png' , fullPage: true });
    //     await page.locator("button[class*='ChatHeader_button'] span").last().click();
    // }
  }
});

test.only("new chatbot", async function ({ page }) {
  page.addInitScript((value) => {
    window.localStorage.setItem("authToken", value);
  }, token);

  await page.goto("https://dev.bytelearn.ai/student/assignment?assignmentId=45057");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(5000);
  const problemcount = page.locator("div.problem-statement h2");
  const problemcount_statement = await problemcount.allTextContents();
  const NoOFQuestion_array = problemcount_statement[0].split(" ");
  const LastQuestion = NoOFQuestion_array[NoOFQuestion_array.length - 1];
  const FirstQuestion = NoOFQuestion_array[1];
  const NoOFQuestion = LastQuestion - FirstQuestion + 1;
  console.log(NoOFQuestion);

  for (z = 0; z < NoOFQuestion; z++) {
    const stick_bottom = page.locator("div.conversations div.stick-bottom");
    const bubble = page.locator("button.bubble");
    await bubble.click({ timeout: 120000 });
    let actualQuestion = await problemcount.allInnerTexts();

    const studentinputbubble = page.locator("div.conversations div.stick-bottom form.chat-interactive");;
    const gif = page.locator("img.chat-image");
    await stick_bottom.waitFor({timeout:120000});

    while (!(await gif.isVisible())) {
      
      if (await studentinputbubble.isVisible()){
      const numberOfInputs = studentinputbubble.locator("div.test_interactive");
      const numberOfInputs_count = await numberOfInputs.count();
      console.log(numberOfInputs_count);
      console.log("while loop");
      let expected_answer;
      let input_field = 0;
      let dropdown_field = 0;
      let textinput_loop = 0;
      let dragdropinput_loop = 0;
      let dragdropinput_field = 0;

      for (let z=0; z<numberOfInputs_count; z++){
        let studentinputtype = await numberOfInputs.nth(z).getAttribute("class");
        console.log(studentinputtype);
        if (studentinputtype.includes("test_input")) {
          input_field++;
        }
        if (studentinputtype.includes("test_dropdown")) {
          dropdown_field++;
        }
        if (studentinputtype.includes("test_dragdropinput")) {
          dragdropinput_field++;
        }
      }
      console.log("Number of input boxes = "+input_field);
      console.log("Number of dropdown boxes = "+dropdown_field);
      console.log("Number of dragdrop boxes = "+dragdropinput_field);

      for (let i=0; i<numberOfInputs_count; i++)
      {
        console.log("For "+i)
        let studentinputtype = await numberOfInputs.nth(i).getAttribute("class");
        console.log(studentinputtype);

        if (studentinputtype.includes("test_input")) {
          if (textinput_loop < input_field) {
            let expectedinput = await page
              .locator("div.interactive_expected_input")
              .getAttribute("data-expected_input");
            let answerkey = await studentinputbubble
              .locator("div.test_input input[type='hidden']").nth(textinput_loop)
              .getAttribute("name");
            let expectedinput_json = await JSON.parse(expectedinput);
            let expected_answer_json = expectedinput_json[0][answerkey];
            let expected_answer = await expected_answer_json.replace(/ +/g, "");
            let input = Object.values(expectedinput_json[0]);  
            await numberOfInputs.nth(i).click();
              //let filtered_input = await input[i].replace(/[\])}[{(]/g, "");
              await numberOfInputs.nth(i).type(expected_answer, { delay: 100 });//earlier filtered_input was used
              //await page.keyboard.press('Tab');
              await problemcount.click();
              textinput_loop++;
        }
      }
        else if (studentinputtype.includes("test_dropdown")) {
          if (dropdowninput_loop < dropdown_field){
                let expectedinput = await page.locator("div.interactive_expected_input").getAttribute("data-expected_input");
                let expectedinput_json = await JSON.parse(expectedinput);
                console.log(expectedinput_json);
                let input_raw = (Object.values(expectedinput_json[0]));
                let input_string = input_raw[0].toString();
                let input = input_string.toLowerCase();
                //console.log(input);
                let newinput;
                let answerkey;
                let new_expected_answer

                if (await numberOfInputs.locator("div.css-17mwl0b-control").nth(dropdowninput_loop).isVisible())
                {
                  console.log("new locator detected")
                    await studentinputbubble.locator("div.css-17mwl0b-control").nth(dropdowninput_loop).click();
                    answerkey = await studentinputbubble.locator("input[type='hidden']").nth(i).getAttribute("name");
                }
          //       else if (await numberOfInputs.nth(i).locator("div.css-9ru2rz-container").isVisible()){
          //           await studentinputbubble.locator("div.css-9ru2rz-container").click();
          //           answerkey = await studentinputbubble
          //         .locator("div.css-9ru2rz-container input[type='hidden']")
          //         .getAttribute("name");
          //       }
          //       else if (await numberOfInputs.nth(i).locator("div.css-fndec8-container").isVisible()){
          //           await studentinputbubble.locator("div.css-fndec8-container").click();
          //           answerkey = await studentinputbubble
          //           .locator("div.css-fndec8-container input[type='hidden']")
          //           .getAttribute("name");
          //       }
          //       else if (await numberOfInputs.nth(i).locator("div.css-1gvdc9a-container").isVisible()){
          //         await studentinputbubble.locator("div.css-1gvdc9a-container").click();
          //         answerkey = await studentinputbubble
          //         .locator("div.css-1gvdc9a-container input[type='hidden']")
          //         .getAttribute("name");
          //     }
              
          //     else if (await numberOfInputs.nth(i).locator("div.css-12hm6ze-container").isVisible()){
          //       await studentinputbubble.locator("div.css-12hm6ze-container").click();
          //       answerkey = await studentinputbubble
          //       .locator("div.css-12hm6ze-container input[type='hidden']")
          //       .getAttribute("name");
          //   }
          //   else if (await numberOfInputs.nth(i).locator("div.css-1rm2zbo-container").isVisible()){
          //     await studentinputbubble.locator("div.css-1rm2zbo-container").click();
          //     answerkey = await studentinputbubble
          //     .locator("div.css-1rm2zbo-container input[type='hidden']")
          //     .getAttribute("name");
          // }
                console.log(answerkey);
                expected_answer = expectedinput_json[0][answerkey];
                if (expected_answer == "-"){
                  expected_answer = "subtract"
                }
              else if (expected_answer == "/"){
                expected_answer = "divide by"
            }
            else if (expected_answer == "*"){
              expected_answer = "multiply by"
          }
          else if (expected_answer == "+"){
            expected_answer = "add"
        }
              else if (expected_answer == ">="){
                expected_answer = "≥"
            }
            else if (expected_answer == "<="){
              expected_answer = "≤"
          }
                let inputboxes = await page.locator("div[id*='react-select'] div div").count();
                console.log(inputboxes);
                for(j=0; j<inputboxes; j++)
                {
                    let dropdowntext_raw = await page.locator("div[id*='react-select'] div div").nth(j).allTextContents();
                    let dropdowntext_string = dropdowntext_raw[0].toString();
                    let dropdowntext = dropdowntext_string.toLowerCase();
                    console.log(dropdowntext);
                    console.log(expected_answer);
                    if (dropdowntext == expected_answer)//input used earleir
                    {
                        await page.waitForTimeout(1000);
                        await page.locator("div[id*='react-select'] div div").nth(j).click();
                        dropdowninput_loop++
                        break;
                    }        
                }
            }   
      }
      else if (studentinputtype.includes("test_dragdropinput")) {
          console.log("Input type = Dragdrop")
          let expectedinput = await page.locator("div.interactive_expected_input").getAttribute("data-expected_input");
          let answerkey = await studentinputbubble.locator("input[type='hidden']").nth(dragdropinput_loop).getAttribute("name");
          let expectedinput_json = await JSON.parse(expectedinput);
          //let input_raw = (Object.values(expectedinput_json[0]));
          let expected_answer_json = expectedinput_json[0][answerkey];
          let expected_answer = await expected_answer_json.replace(/`/g, "");
          // console.log(expectedinput_json);
          // console.log(expectedinput_json[0]);
          // console.log(input_raw);
          // console.log(input_raw[0]);
  
          let dragitems = await page.locator("div.dragabble-row.drag-target").count();
          // console.log(dragitems);
          let dragitems_loc = page.locator('div.dragabble-row.drag-options div.drag-draggable');
  
          for(let j=0; j<dragitems; j++)
          {
                  let dragitemvalue = await dragitems_loc.nth(j).getAttribute("data-option");
                  console.log(dragitemvalue);
                  let finaldragitemvalue = await dragitemvalue.replace(/`/g, "");
                  
                  if (finaldragitemvalue == expected_answer)
                  {
                      await page.waitForTimeout(1000);
                      let droptarget = page.locator('div.drag-input').nth(dragdropinput_loop);
                      await dragitems_loc.nth(j).dragTo(droptarget);
                      dragdropinput_loop++;
                      break;
                  }
                }
  
      }
    }
    console.log("for loop over");
    await studentinputbubble.locator('button', { hasText: 'Check' }).click();
    await page.locator("button.btn").last().waitFor({state: 'visible', timeout:60000});
      }
      else if (await stick_bottom.locator("button.bubble").isVisible()){
        await stick_bottom.locator("button.bubble").click();
      }
    }
    await page.screenshot({ path: actualQuestion[0] + ".png", fullPage: true });
    await page.locator("button.btn:visible").last().click();

    // catch(e)
    // {
    //     let questionid = page.locator("div.problem-statement span");
    //     let actualQuestion = await problemcount.allInnerTexts();
    //     console.log(actualQuestion[0] +" Problem Crashed");
    //     await page.screenshot({ path: actualQuestion[0]+'.png' , fullPage: true });
    //     await page.locator("button[class*='ChatHeader_button'] span").last().click();
    // }
    }
  
  });