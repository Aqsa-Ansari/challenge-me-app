import { API_BASE_URL as baseURL } from "../config.js";

const controllerURL = '/api/challenges'

export async function getRandomChallengeAPI() {
    return fetch(`${baseURL}${controllerURL}/random`);
}