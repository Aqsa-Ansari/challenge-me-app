import { removeResponseOptions } from "./renderResponses.js";

export function renderChallenge(challenge, submitResponse) {
  const mainElement = document.querySelector("main");

  // Remove old elements if any
  document.querySelector("#challengeText")?.remove();
  document.querySelector("#responseForm")?.remove();
  removeResponseOptions();

  // Add challenge
  const challengeTextPara = document.createElement("p");
  challengeTextPara.id = "challengeText";
  challengeTextPara.textContent = challenge.text;
  challengeTextPara.className = "mx-auto mt-6 mb-4 max-w-xl px-4 text-center text-2xl font-medium text-gray-800";
  mainElement.insertBefore(challengeTextPara, mainElement.firstChild);

  // Add form for responses
  const responseFormElement = document.createElement("form");
  responseFormElement.id = "responseForm";
  responseFormElement.className = "flex flex-col w-full max-w-xl mx-auto gap-4";
  responseFormElement.setAttribute("action", "javascript:void(0)");
  responseFormElement.setAttribute("method", "POST");
  responseFormElement.addEventListener("submit", submitResponse);

  const textareaElement = document.createElement("textarea");
  textareaElement.className = "w-full max-w-xl h-40 px-4 py-2 text-base border rounded resize-y overflow-y-auto touch-auto";
  textareaElement.setAttribute("name", "responseTextarea");
  textareaElement.setAttribute("type", "text");

  const submitBtnElement = document.createElement("input");
  submitBtnElement.className = "self-end cursor-pointer rounded bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600";
  submitBtnElement.setAttribute("type", "submit");

  responseFormElement.appendChild(textareaElement);
  responseFormElement.appendChild(submitBtnElement);

  mainElement.appendChild(responseFormElement);
}
