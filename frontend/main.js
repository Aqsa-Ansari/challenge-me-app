const baseURL = "http://localhost:5000"
let currentChallengeId = null;

async function getChallenge(){    
    //GET challenge using API
    try{
        const result = await fetch(`${baseURL}/api/challenges/random`);

        if (result.ok) {
            const challenge = await result.json()

            console.log("Random challenge received: ", challenge)
            currentChallengeId = challenge.id

            const mainElement = document.querySelector("main");

            // Remove old elements if any
            document.querySelector("#challengeText")?.remove();
            document.querySelector("#responseForm")?.remove();

            // Add challenge
            const challengeTextPara = document.createElement("p");
            challengeTextPara.id = "challengeText";
            challengeTextPara.textContent = challenge.text;
            mainElement.insertBefore(challengeTextPara, mainElement.firstChild);

            // Add form for responses
            const responseFormElement = document.createElement("form");
            responseFormElement.id = "responseForm";
            responseFormElement.setAttribute("action", "javascript:void(0)");
            responseFormElement.setAttribute("method", "POST");
            responseFormElement.addEventListener("submit", submitResponse);

            const textareaElement = document.createElement("input");
            textareaElement.setAttribute("name", "responseTextarea");
            textareaElement.setAttribute("type", "text");

            const submitBtnElement = document.createElement("input");
            submitBtnElement.setAttribute("type", "submit");

            responseFormElement.appendChild(textareaElement);
            responseFormElement.appendChild(submitBtnElement);

            mainElement.appendChild(responseFormElement);
        }
        else {
            console.log("Not OK result from API: ", result.status, await result.text())
            //TODO: show reason
        }
    }
    catch(error) {
        console.log("GET random challenge API call failed ", error)
        //TODO: show api call failed
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

    // console.log("Response body to send: ", responseObj)
    
    //POST response using API
    try {
        const result = await fetch(`${baseURL}/api/responses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(responseObj)
        });
        
        // Remove old elements if any
            document.querySelector("#delResBtn")?.remove();
            document.querySelector("#seeResBtn")?.remove();
            document.querySelector("#responseslist")?.remove();

        if (result.ok) {
            const newResponse = await result.json();
            console.log("New Response saved: ", newResponse)
    
            formElement.responseTextarea.value = ""
        
            //adding action buttons after response is submitted
            const deleteResponseBtnElement = document.createElement("button");
            deleteResponseBtnElement.id = "delResBtn"
            deleteResponseBtnElement.textContent = "Delete my response"
            deleteResponseBtnElement.addEventListener("click", () => deleteResponse(newResponse.id))
        
            const seeResponsesBtnElement = document.createElement("button");
            seeResponsesBtnElement.id = "seeResBtn"
            seeResponsesBtnElement.textContent = "See others' responses"
            seeResponsesBtnElement.addEventListener("click", () => seeResonses(newResponse.id))
        
            document.querySelector("main").appendChild(deleteResponseBtnElement)
            document.querySelector("main").appendChild(seeResponsesBtnElement)
        
            //TODO: show that it's submitted
        }
        else {
            console.log("Not OK result from API: ", result.status, await result.text())
            //TODO: show reason
        }
    }
    catch(error){
        console.log("POST submit response API call failed ", error)
        //TODO: show api call failed
    }
}


async function deleteResponse(responseId){
    //DELETE response with responseId using API
    try {
        const result = await fetch(`${baseURL}/api/responses/${responseId}`, {
            method: "DELETE"
        });
        
        if(result.ok){
            //TODO: show response is deleted

            //disable the button which called this method
            const delResBtnElem = document.querySelector("#delResBtn")
            delResBtnElem.disabled = true
        }
        console.log("Last submitted response deleted: ", await result.text())
    }
    catch (error) {
        console.log("DELETE response by responseId API call failed ", error)
        //TODO: show api call failed
    }
}


async function seeResonses(responseId){
    //GET all responses of same challenge using API
    try{
        const result = await fetch(`${baseURL}/api/responses/${currentChallengeId}`)
        if (result.ok){
            const responses = await result.json()
    
            console.log("All responses for same challenge retrieved: ", responses)
            
            //dynamic rendering fetched responses
            let responsesListElement = document.createElement("div");
            responsesListElement.id = "responseslist"
    
            //TODO: filter out their own response with responseId
            const filteredResponses = responses.filter(r => r.id !== responseId);
                

            {filteredResponses.length > 0 ? 
                filteredResponses.map((response) => {
                    let responseElement = document.createElement("div");
                    responseElement.textContent = response.text + response.rating
                    
                    let ratingBtnElement = document.createElement("button")
                    ratingBtnElement.id =  `rbtn_${response.id}`
                    ratingBtnElement.textContent = "give rating 3"      //TODO: put stars instead from tailwind
                    ratingBtnElement.addEventListener("click", () => giveRating(response.id, 4))
        
                    responseElement.appendChild(ratingBtnElement)
        
                    responsesListElement.appendChild(responseElement);
                }) 
                : 
                responsesListElement.textContent = "No responses posted for this challenge yet"      
            }
            document.querySelector("main").appendChild(responsesListElement);

            //disable the button which called this method
            const seeResBtnElem = document.querySelector("#seeResBtn")
            seeResBtnElem.disabled = true
        }
        else {
            console.log("Not OK result from API: ", result.status, await result.text())
            //TODO: show reason
        }
    }
    catch (error) {
        console.log("GET responses against a challenge API call failed ", error)
        //TODO: show api call failed
    }
}


async function giveRating(responseId, rating) {
    //UPDATE rating in a response by responseId using API
    try{
        const result = await fetch(`${baseURL}/api/responses/${responseId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                rating: rating
            })
        })
    
        if(result.ok){
            const updatedResponse = await result.json()
            console.log("Response updated: ", updatedResponse)
            //TODO: show that rating is recorded

            //disable the button which called this method
            const ratingBtnElem = document.querySelector(`#rbtn_${responseId}`)
            ratingBtnElem.disabled = true
        }
        else {
            console.log("Not OK result from API: ", result.status, await result.text())
            //TODO: show reason
        }
    }
    catch (error) {
        console.log("PATCH response API call failed ", error)
        //TODO: show api call failed
    }
}
