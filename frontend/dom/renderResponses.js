const buttonBaseClasses =
  "px-4 py-2 rounded text-sm font-medium transition duration-200";


export const renderResponseOptions = (newResponse, deleteResponse, seeResonses) => {
    const actionBtnElement = document.createElement("div")
    actionBtnElement.className = "mx-auto mt-6 flex gap-4 max-w-xl justify-start w-full";

    const deleteResponseBtnElement = document.createElement("button");
    deleteResponseBtnElement.id = "delResBtn"
    deleteResponseBtnElement.className = buttonBaseClasses + " bg-red-100 text-red-600 hover:bg-red-200";
    deleteResponseBtnElement.textContent = "Delete my response"
    deleteResponseBtnElement.addEventListener("click", () => deleteResponse(newResponse.id))

    const seeResponsesBtnElement = document.createElement("button");
    seeResponsesBtnElement.id = "seeResBtn"
    seeResponsesBtnElement.className = buttonBaseClasses + " bg-gray-100 text-gray-700 hover:bg-gray-200";
    seeResponsesBtnElement.textContent = "See others' responses"
    seeResponsesBtnElement.addEventListener("click", () => seeResonses(newResponse.id))

    actionBtnElement.appendChild(deleteResponseBtnElement)
    actionBtnElement.appendChild(seeResponsesBtnElement)

    document.querySelector("main").appendChild(actionBtnElement);
}


export const removeResponseOptions = () => {
    document.querySelector("#delResBtn")?.remove();
    document.querySelector("#seeResBtn")?.remove();
    document.querySelector("#responseslist")?.remove();
}


export const renderResponsesList = (responses, giveRating) => {
    let responsesListElement = document.createElement("div");
    responsesListElement.id = "responseslist"                
    responsesListElement.className = "flex flex-col gap-4 max-w-3xl mx-auto px-4 py-6";

    {responses.length > 0 ? 
        responses.map((response) => {
            const responseElement = createResponseElement(response.text, response.id, response.rating, giveRating)
            // let responseElement = document.createElement("div");
            // responseElement.textContent = response.text + response.rating
            
            // let ratingBtnElement = document.createElement("button")
            // ratingBtnElement.id =  `rbtn_${response.id}`
            // ratingBtnElement.textContent = "give rating 3"      //TODO: put stars instead from tailwind
            // ratingBtnElement.addEventListener("click", () => giveRating(response.id, 3))   //TODO: get this rating from the stars component

            // responseElement.appendChild(ratingBtnElement)

            responsesListElement.appendChild(responseElement);
        }) 
        : 
        responsesListElement.textContent = "No responses posted for this challenge yet"      
    }
    document.querySelector("main").appendChild(responsesListElement);
}


const createResponseElement = (responseText, responseId, currentRating = 0, giveRating) => {
  // Main card container
  const responseElement = document.createElement("div");
  responseElement.className =
    "rounded-xl border border-gray-200 bg-white p-5 shadow-md flex justify-between items-start gap-4 mb-4";

  // LEFT SIDE: text + current rating
  const leftContainer = document.createElement("div");
  leftContainer.className = "flex flex-col gap-2";

  const textElement = document.createElement("p");
  textElement.textContent = responseText;
  textElement.className = "text-gray-800 text-base";

  const currentRatingDisplay = document.createElement("div");
  currentRatingDisplay.className = "flex items-center gap-1 text-sm text-gray-600";
  currentRatingDisplay.innerHTML = `
    <span class="text-yellow-500 text-base">★</span>
    <span>${currentRating.toFixed(1)}</span>
  `;

  leftContainer.appendChild(textElement);
  leftContainer.appendChild(currentRatingDisplay);

  // RIGHT SIDE: star rating input
  const rightContainer = document.createElement("div");
rightContainer.className = "flex items-center gap-1";

// Keep per-response rating state
let alreadyRated = false;

for (let i = 1; i <= 5; i++) {
  const starBtn = document.createElement("button");
  starBtn.innerText = "★";
  starBtn.title = `Rate ${i}`;
  starBtn.dataset.rating = i;

  starBtn.className =
    "text-xl text-gray-300 transition duration-200 hover:text-yellow-400";

  starBtn.addEventListener("click", async () => {
  if (alreadyRated) return;

  const rating = parseInt(starBtn.dataset.rating);

  Array.from(rightContainer.children).forEach((star, index) => {
    // Color the selected stars
    star.classList.remove("text-yellow-400", "text-gray-300", "hover:text-yellow-400");

    if (index < rating) {
      star.classList.add("text-yellow-400");
    } else {
      star.classList.add("text-gray-300");
    }

    // Visually indicate disabled
    star.classList.add("opacity-50", "cursor-not-allowed");
    star.disabled = true;
  });

  const updatedResponse = await giveRating(responseId, rating)
  currentRatingDisplay.innerHTML = `
    <span class="text-yellow-500 text-base">★</span>
    <span>${updatedResponse.rating.toFixed(1)}</span>
  `;
  console.log(`Rated response ${responseId} with ${rating} stars`);
  alreadyRated = true;
});


  rightContainer.appendChild(starBtn);
}


  responseElement.appendChild(leftContainer);
  responseElement.appendChild(rightContainer);

  return responseElement;
};
