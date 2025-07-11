//// if type:module in package.json
// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();


//// if type:commonjs in package.json file, then
const { deepStrictEqual } = require("assert");
const express = require("express");
require("dotenv").config();
const fs = require("fs");


const app = express();

// GET    /api/challenges/random           → Get a random challenge
// GET    /api/challenges/:id/responses    → Get responses for a specific challenge
// POST   /api/responses                   → Add a new response
// DELETE /api/responses/:id               → Delete a response by ID
// PATCH  /api/responses/:id               → Update a response (e.g. rating)



app.get('/', (req, res) => {
  res.send('app is up')
})

app.get('/api/challenges/random', (req, res) => {

    //reading and parsing all challenges from the json file
    fs.readFile("./data/challenges.json", (error, data) => {
        if(error){
            //error handling
        }
    
    else{
        const challenges = JSON.parse(data);

        // selecting a random challenge
        const randomIndex = Math.floor(Math.random() * challenges.length);
        const randomChallenge = challenges[randomIndex];

        res.send(randomChallenge)
    }})
})


app.get('/api/challenges/:id/responses', (req, res) => {

    // reading and parsing all responses from file
    fs.readFile("./data/responses.json", (error, data) => {
        if(error){
            //error handling
        }
        else{
            const responses = JSON.parse(data);

            //filtering the resonses with have the asked challenged id
            const filteredResponses = responses.filter(response => response.challengeId === req.params.id)
            
            res.send(filteredResponses)

        }
    })  
})


// app.post('/api/responses', (req, res) => {
//     const dummyResponse = {}

// })


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on ${port}...`))