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
            showToast("Something went wrong!", "error");
        }
    }
    catch(error) {
        console.log("GET random challenge API call failed ", error)
        showToast("Network error occurred", "error");
    }
}

function submitResponse(event) {
    event.preventDefault()

    const formElement = document.querySelector("form")
    const formData = new FormData(formElement)
    const responseText = formData.get("responseTextarea");
    
    //client-side form validation
    if(responseText == ""){
        showToast("Please write your response to submit", "error");

        console.log("response box is empty")
        return
    }

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
            showToast("Submitted successfully!", "success");
        }
        else {
            console.log("Not OK result from API: ", result.status, await result.text())
            showToast("Something went wrong!", "error");
        }
    })
    .catch(error => {
        console.log("POST submit response API call failed ", error)
        showToast("Network error occurred", "error");
    })
}


function deleteResponse(responseId) {
    //DELETE response with responseId using API
    deleteResponseAPI(responseId)
    .then(async result => {
        if(result.ok){
            showToast("Deleted successfully!", "success");
    
            //disable the button which called this method
            const delResBtnElem = document.querySelector("#delResBtn")
            delResBtnElem.disabled = true
            delResBtnElem.classList.add("opacity-50", "cursor-not-allowed");
        }
        console.log("Last submitted response deleted: ", await result.text())
    })
    .catch (error => {
        console.log("DELETE response by responseId API call failed ", error)
        showToast("Network error occurred", "error");
    })
}


function seeResonses(responseId) {
    //GET all responses of same challenge using API
    getResponsesByChallengeAPI(currentChallengeId)
    .then(async result => {
        if (result.ok){
            const responses = await result.json()
    
            console.log("All responses for same challenge retrieved: ", responses)
            
            //filter out their own response with responseId
            const filteredResponses = responses.filter(r => r.id !== responseId);
            
            //dynamic render fetched responses if any
            renderResponsesList(filteredResponses, giveRating)

            //disable the button which called this method
            const seeResBtnElem = document.querySelector("#seeResBtn")
            seeResBtnElem.disabled = true
            seeResBtnElem.classList.add("opacity-50", "cursor-not-allowed");
        }
        else {
            console.log("Not OK result from API: ", result.status, await result.text())
            showToast("Something went wrong!", "error");
        }
    })
    .catch (error => {
        console.log("GET responses against a challenge API call failed ", error)
        showToast("Network error occurred", "error");
    })
}


function giveRating(responseId, rating) {
    //UPDATE rating in a response by responseId using API
    return patchResponseAPI(responseId, {
                rating: rating
            })
    .then(async result => {
        if(result.ok){
            const updatedResponse = await result.json()
            console.log("Response updated: ", updatedResponse)
            showToast("Rating updated successfully!", "success");
            return updatedResponse;
        }
        else {
            console.log("Not OK result from API: ", result.status, await result.text())
            showToast("Something went wrong!", "error");
            return null
        }
    })
    .catch (error => {
        console.log("PATCH response API call failed ", error)
        showToast("Network error occurred", "error");
        return null
    })
}


function showToast(message, type = "success", duration = 3000) {
    const toast = document.createElement("div");

    const baseClasses =
        "px-4 py-2 rounded shadow-md text-white text-sm flex items-center gap-2";
    const typeClasses =
        type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-gray-700";

    toast.className = `${baseClasses} ${typeClasses}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="ml-auto text-white hover:opacity-70" onclick="this.parentElement.remove()">×</button>
    `;

    document.getElementById("toast-container").appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}
