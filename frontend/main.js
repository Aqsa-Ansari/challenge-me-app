import { getRandomChallengeAPI } from "./api/challengesAPI.js";
import { postResponseAPI, deleteResponseAPI, getResponsesByChallengeAPI, patchResponseAPI } from './api/responsesAPI.js';
import { renderChallenge } from "./dom/renderChallenge.js"
import { removeResponseOptions, renderResponseOptions, renderResponsesList } from "./dom/renderResponses.js";

let currentChallengeId = null;

document.querySelector("#startBtn").addEventListener("click", getChallenge);

async function getChallenge() { 
    //GET a random challenge
    try{
        const result = await getRandomChallengeAPI();

        if (result.ok) {
            const challenge = await result.json()

            console.log("Random challenge received: ", challenge)
            currentChallengeId = challenge.id

            renderChallenge(challenge, submitResponse)
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

function submitResponse(event) {
    event.preventDefault()

    const formElement = document.querySelector("form")
    const formData = new FormData(formElement)
    const responseText = formData.get("responseTextarea");
    
    //TODO: make sure response text not empty
    const responseObj = {
        "sawal": currentChallengeId,
        "jawab": responseText
    }

    // console.log("Response body to send: ", responseObj)
    
    //POST response using API
        postResponseAPI(responseObj)
        .then(async result => {
            // Remove old elements if any
            removeResponseOptions()
    
            if (result.ok) {
                const newResponse = await result.json();
                console.log("New Response saved: ", newResponse)
        
                formElement.responseTextarea.value = ""
            
                //adding action buttons after response is submitted
                renderResponseOptions(newResponse, deleteResponse, seeResonses)

                //TODO: show that it's submitted
            }
            else {
                console.log("Not OK result from API: ", result.status, await result.text())
                //TODO: show reason
            }
        })
        .catch(error => {
            console.log("POST submit response API call failed ", error)
            //TODO: show api call failed
        })
}


function deleteResponse(responseId) {
    //DELETE response with responseId using API
    deleteResponseAPI(responseId)
    .then(async result => {
        if(result.ok){
            //TODO: show response is deleted
    
            //disable the button which called this method
            const delResBtnElem = document.querySelector("#delResBtn")
            delResBtnElem.disabled = true
        }
        console.log("Last submitted response deleted: ", await result.text())
    })
    .catch (error => {
        console.log("DELETE response by responseId API call failed ", error)
        //TODO: show api call failed
    })
}


function seeResonses(responseId) {
    //GET all responses of same challenge using API
    getResponsesByChallengeAPI(currentChallengeId)
    .then(async result => {
        if (result.ok){
            const responses = await result.json()
    
            console.log("All responses for same challenge retrieved: ", responses)
            
            //TODO: filter out their own response with responseId
            const filteredResponses = responses.filter(r => r.id !== responseId);
            
            //dynamic rendering fetched responses if any
            renderResponsesList(filteredResponses, giveRating)

            //disable the button which called this method
            const seeResBtnElem = document.querySelector("#seeResBtn")
            seeResBtnElem.disabled = true
        }
        else {
            console.log("Not OK result from API: ", result.status, await result.text())
            //TODO: show reason
        }
    })
    .catch (error => {
        console.log("GET responses against a challenge API call failed ", error)
        //TODO: show api call failed
    })
}


function giveRating(responseId, rating) {
    //UPDATE rating in a response by responseId using API
    patchResponseAPI(responseId, {
                rating: rating
            })
    .then(async result => {
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
    })
    .catch (error => {
        console.log("PATCH response API call failed ", error)
        //TODO: show api call failed
    })
}
