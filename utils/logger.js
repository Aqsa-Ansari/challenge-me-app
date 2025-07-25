import { ENV } from "../config.js";

const isDevelopment = ENV === 'dev';


export const log = (...args) => isDevelopment && console.log(...args)

export const warn = (...args) => isDevelopment && console.warn(...args)

export const error = (...args) => isDevelopment && console.error(...args)
