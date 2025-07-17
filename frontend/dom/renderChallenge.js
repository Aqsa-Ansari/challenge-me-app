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
