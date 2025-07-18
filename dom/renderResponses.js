export const renderResponseOptions = (newResponse, deleteResponse, seeResonses) => {
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
}

export const removeResponseOptions = () => {
    document.querySelector("#delResBtn")?.remove();
    document.querySelector("#seeResBtn")?.remove();
    document.querySelector("#responseslist")?.remove();
}

export const renderResponsesList = (responses, giveRating) => {
    let responsesListElement = document.createElement("div");
    responsesListElement.id = "responseslist"                

    {responses.length > 0 ? 
        responses.map((response) => {
            let responseElement = document.createElement("div");
            responseElement.textContent = response.text + response.rating
            
            let ratingBtnElement = document.createElement("button")
            ratingBtnElement.id =  `rbtn_${response.id}`
            ratingBtnElement.textContent = "give rating 3"      //TODO: put stars instead from tailwind
            ratingBtnElement.addEventListener("click", () => giveRating(response.id, 3))   //TODO: get this rating from the stars component

            responseElement.appendChild(ratingBtnElement)

            responsesListElement.appendChild(responseElement);
        }) 
        : 
        responsesListElement.textContent = "No responses posted for this challenge yet"      
    }
    document.querySelector("main").appendChild(responsesListElement);
}
