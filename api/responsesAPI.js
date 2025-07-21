import { API_BASE_URL as baseURL } from "../config.js";

const controllerURL = '/api/responses'

export const postResponseAPI = async (responseObj) => {
    return fetch(`${baseURL}${controllerURL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(responseObj)
    })
}

export const deleteResponseAPI = async (responseId) => {
    return fetch(`${baseURL}${controllerURL}/${responseId}`, {
            method: "DELETE"
        })
}

export const getResponsesByChallengeAPI = async (challengeId) => {
    return await fetch(`${baseURL}${controllerURL}/${challengeId}`)
}

export const patchResponseAPI = async (responseId, responsePatch) => {
    return await fetch(`${baseURL}${controllerURL}/${responseId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(responsePatch)
    })
}
