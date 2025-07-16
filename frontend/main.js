const baseURL = "http://localhost:5000"
let currentChallengeId = null;

async function getChallenge(){
    // const challenge = {text: "write a poem"}     //dummy
    
    //GET challenge using API
    try{
        const result = await fetch(`${baseURL}/api/challenges/random`);
        const challenge = await result.json()

        console.log("Random challenge received: ", challenge)
        currentChallengeId = challenge.id

        const challengeTextPara = document.createElement("p");
        challengeTextPara.textContent = challenge.text;

        const mainElement = document.querySelector("main");
        mainElement.insertBefore(challengeTextPara, mainElement.firstChild)


        // creating form for responses
        const responseFormElement = document.createElement("form");
        responseFormElement.setAttribute("action", "javascript:void(0)");
        responseFormElement.setAttribute("method", "POST");
        responseFormElement.addEventListener("submit", submitResponse);

        const textareaElement = document.createElement("input")
        textareaElement.setAttribute("name", "responseTextarea");
        textareaElement.setAttribute("type", "text");

        const submitBtnElement = document.createElement("input");
        submitBtnElement.setAttribute("type", "submit");

        responseFormElement.appendChild(textareaElement);
        responseFormElement.appendChild(submitBtnElement);

        document.querySelector("main").appendChild(responseFormElement);
    }
    catch(error) {
        console.log("Failed to call api ", error)
    }
}

async function submitResponse(event) {
    event.preventDefault()

    const formElement = document.querySelector("form")
    const formData = new FormData(formElement)
    const responseText = formData.get("responseTextarea");
    
    const responseObj = {
        "sawal": currentChallengeId,
        "jawab": responseText
    }

    console.log("Response body to send: ", responseObj)
    
    //POST response via api
    try {
        const result = await fetch(`${baseURL}/api/responses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(responseObj)
        });
        
        const newResponse = await result.json();
        
        console.log("New Response saved: ", newResponse)

        formElement.responseTextarea.value = ""
    
        //adding action buttons after response is submitted
        const deleteResponseBtnElement = document.createElement("button");
        deleteResponseBtnElement.textContent = "Delete my response"
        deleteResponseBtnElement.addEventListener("click", () => deleteResponse(newResponse.id))
    
        const seeResponsesBtnElement = document.createElement("button");
        seeResponsesBtnElement.textContent = "See others' responses"
        seeResponsesBtnElement.addEventListener("click", seeResonses)   //doesn't send args 
    
        document.querySelector("main").appendChild(deleteResponseBtnElement)
        document.querySelector("main").appendChild(seeResponsesBtnElement)
    
        //TODO: show alert that it's submitted
    }
    catch(error){
        console.log("error", error)
    }
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
