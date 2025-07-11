async function getChallenge(){
    const challenge = {text:"write a poem"}     //dummy
    
    //GET challenge from backend

    console.log(challenge.text)

    const challengeTextPara = document.createElement("p");
    challengeTextPara.textContent = challenge.text;

    const mainElement = document.querySelector("main");
    mainElement.insertBefore(challengeTextPara, mainElement.firstChild)


    // creating form for resonses
    const responseFormElement = document.createElement("form");
    responseFormElement.addEventListener("submit", () => submitResponse(event));

    const textareaElement = document.createElement("input")
    textareaElement.setAttribute("name", "responseTextarea");
    textareaElement.setAttribute("type", "text");

    const submitBtnElement = document.createElement("input");
    submitBtnElement.setAttribute("type", "submit");

    responseFormElement.appendChild(textareaElement);
    responseFormElement.appendChild(submitBtnElement);

    document.querySelector("main").appendChild(responseFormElement);
}

async function submitResponse(event) {
    event.preventDefault();

    // const responseText = document.querySelector('input[name="responseTextarea"]').value;
    //// OR
    // const responseTextareaElement = document.getElementsByName('responseTextarea')[0];
    // const responseText = responseTextareaElement.value;
    //// OR
    const formElement = document.querySelector("form")
    const formData = new FormData(formElement)
    const responseText = formData.get("responseTextarea");
    
    console.log(responseText)
    //POST response to backend, receives a responseid back
    let responseId = "r1";

    // document.querySelector('input[name="responseTextarea"]').value = "";
    //// OR
    // document.getElementsByName('responseTextarea')[0].value = "";
    //// OR
    formElement.responseTextarea.value = "";


    //adding action buttons after response is submitted
    const deleteResponseBtnElement = document.createElement("button");
    deleteResponseBtnElement.textContent = "Delete my response"
    deleteResponseBtnElement.addEventListener("click", () => deleteResponse(responseId))

    const seeResponsesBtnElement = document.createElement("button");
    seeResponsesBtnElement.textContent = "See others' responses"
    seeResponsesBtnElement.addEventListener("click", seeResonses)   //doesn't send args 

    document.querySelector("main").appendChild(deleteResponseBtnElement)
    document.querySelector("main").appendChild(seeResponsesBtnElement)

    alert("response is submitted")
}


async function deleteResponse(responseId){
    console.log("delete response called to delete response with ", responseId)
    //DELETE response with responseId

    alert("response is deleted")
}


async function seeResonses(){
    console.log("see others' responses is called")

    //GET all responses of other people from backend
    let responses = [
        {id: "rr1", text:"fasf", rating: 4},
        {id: "rr2", text:"awrq", rating: 2},
        {id: "rr3", text:"fawr", rating: 0},
        {id: "rr4", text:"3256", rating: 1}
    ]
    
    //dynamic rendering fetched responses
    let responsesListElement = document.createElement("div");

    responses.map((response) => {
        let responseElement = document.createElement("div");
        responseElement.textContent = response.text + response.rating
        
        let ratingBtnElement = document.createElement("button")
        ratingBtnElement.textContent = "give rating 3"      //TODO: put stars instead from tailwind
        ratingBtnElement.addEventListener("click", () => giveRating(response.id, 4))

        responseElement.appendChild(ratingBtnElement)

        responsesListElement.appendChild(responseElement);
    })

    document.querySelector("main").appendChild(responsesListElement);
}


async function giveRating(responseId, rating) {
    console.log("update rating called")

    //UPDATE rating in a specific response in backend
}
