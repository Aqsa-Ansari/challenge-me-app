import { baseURL } from "../config.js";

const controllerURL = '/api/challenges'

export async function getRandomChallengeAPI() {
    return fetch(`${baseURL}${controllerURL}/random`);
}