//// if type:module in package.json
// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();


//// if type:commonjs in package.json file, then
const express = require("express");
require("dotenv").config();
const fs = require("fs");
const Joi = require('joi');


const app = express();
app.use(express.json());

// GET    /api/challenges/random           → Get a random challenge
// GET    /api/challenges/:id/responses    → Get responses for a specific challenge
// POST   /api/responses                   → Add a new response
// DELETE /api/responses/:id               → Delete a response by ID
// PATCH  /api/responses/:id               → Update a response (e.g. rating)



app.get('/', (req, res) => {
  res.send('challenge me app is up')
})


app.get('/api/challenges/random', (req, res) => {
    //reading and parsing all challenges from the json file
    fs.readFile("./data/challenges.json", (error, data) => {
        if(error){
           return res.status(500).send("Can't read data file")      //return to the rest is not executed
        }
        else {
            const challenges = JSON.parse(data);

            if(challenges.length > 0){
                // selecting a random challenge
                const randomIndex = Math.floor(Math.random() * challenges.length);
                const randomChallenge = challenges[randomIndex];

                return res.send(randomChallenge)
            }
            else {
                return res.status(404).send("No challenge found")
            }
        }
    })
})


app.get('/api/challenges/:id/responses', (req, res) => {
    // reading and parsing all responses from file
    fs.readFile("./data/responses.json", (error, data) => {
        if(error){
            return res.status(500).send("Can't read data file")
        }
        else{
            const responses = JSON.parse(data);

            //filtering the resonses with have the asked challenged id
            const filteredResponses = responses.filter(response => response.challengeId === req.params.id)  //parseInt(req.params.key) if the value is integer 
            
            return res.status(200).send(filteredResponses)
        }
    })  
})


app.post('/api/responses', (req, res) => {
    //validating request body using joi
    const schema = Joi.object({
        sawal: Joi.string().required(),
        jawab: Joi.string().required()
    })

    const {error, value} = schema.validate(req.body, { abortEarly: false });     //result obj destructured for result.error and result.value

    if(error){
        const messages = error.details.map(err => err.message).join(", ");
        return res.status(400).send(messages)
    }

    const newId = Date.now().toString();
    const newResponse = {id: newId, text: value.jawab, challengeId: value.sawal, rating:0, votes:0}

    fs.readFile("./data/responses.json", (error, data) => {
        if(error){
            return res.status(500).send("Can't read data file")
        }
        else{
            const responses = JSON.parse(data)
            responses.push(newResponse)
            
            //writing all to same file
            fs.writeFile("./data/responses.json", JSON.stringify(responses, null, 2), "utf-8", (err) => {
                if (err) {
                    return res.status(500).send("Can't write to data file")
                } else {
                    return res.status(200).send(newId)
                }
            });
        }
    })  
})


app.delete('/api/responses/:id', (req, res) => {
    fs.readFile("./data/responses.json", (error, data) => {
        if(error){
            return res.status(500).send("Can't read data file")
        }
        else{
            const responses = JSON.parse(data)
            if(responses.length > 0) {
                if(responses.find(r => r.id === req.params.id)) {
                    const updatedResponses = responses.filter(r => r.id !== req.params.id);
                
                    //writing all to same file
                    fs.writeFile("./data/responses.json", JSON.stringify(updatedResponses, null, 2), "utf-8", (err) => {
                        if (err) {
                            return res.status(500).send("Can't write to data file")
                        } else {
                            return res.status(200).send("Your response is deleted")
                        }
                    });
                }
                else {
                    return res.status(404).send("Response to delete not found")
                }
            }
            else {
                return res.status(404).send("No response found to delete")
            }
        }
    })
})


app.patch('/api/responses/:id', (req, res) => {
    //validating the body using joi
    const schema = Joi.object({
        rating: Joi.number().min(1).max(5).required()
    })

    const {error, value} = schema.validate(req.body, { abortEarly: false });     //result obj destructured for result.error and result.value

    if(error){
        const messages = error.details.map(err => err.message).join(", ");
        return res.status(400).send(messages)
    }

    fs.readFile("./data/responses.json", (error, data) => {
        if(error){
            return res.status(500).send("Can't read data file")
        }
        else {
            const responses = JSON.parse(data)
            
            if(responses.length > 0) {
                const responseToUpdate = responses.find(r => r.id === req.params.id)

                if(responseToUpdate !== undefined) {
                    const accurateRating = (responseToUpdate.rating * responseToUpdate.votes + value.rating) / (responseToUpdate.votes + 1);
                    responseToUpdate.rating = parseFloat(accurateRating.toFixed(1))
                    responseToUpdate.votes += 1;
                    
                    //writing all to same file
                    fs.writeFile("./data/responses.json", JSON.stringify(responses, null, 2), "utf-8", (err) => {
                        if (err) {
                            return res.status(500).send("Can't write to data file")
                        } else {
                            return res.status(200).send(responseToUpdate)
                        }
                    });
                }
                else {
                    return res.status(404).send("Response to rate not found")
                }
            }
            else {
                return res.status(404).send("No response found to rate")
            }
        }
    })
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on ${port}...`))