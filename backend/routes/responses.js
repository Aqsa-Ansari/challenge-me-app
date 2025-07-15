const express = require("express");
const fs = require("fs");
const router = express.Router();

const Joi = require('joi');
const { createResponseSchema, updateRatingSchema } = require("../validators/requestValidationSchemas");

// GET    /api/responses/:challengeId    → Get responses for a specific challenge
// POST   /api/responses                   → Add a new response
// DELETE /api/responses/:id               → Delete a response by ID
// PATCH  /api/responses/:id               → Update a response (e.g. rating)


router.get('/:challengeId', (req, res) => {
    // reading and parsing all responses from file
    fs.readFile("./data/responses.json", (error, data) => {
        if(error){
            return res.status(500).send("Failed to read data file")
        }
        else{
            const responses = JSON.parse(data);

            //filtering the resonses with have the asked challenged id
            const filteredResponses = responses.filter(response => response.challengeId === req.params.challengeId)  //parseInt(req.params.key) if the value is integer 
            
            return res.status(200).send(filteredResponses)
        }
    })  
})

router.post('/', (req, res) => {
    //validating request body using joi
    const {error, value} = createResponseSchema.validate(req.body, { abortEarly: false });     //result obj destructured for result.error and result.value

    if(error){
        const messages = error.details.map(err => err.message).join(", ");
        return res.status(400).send(messages)
    }

    const newId = Date.now().toString();
    const newResponse = {id: newId, text: value.jawab, challengeId: value.sawal, rating:0, votes:0}

    fs.readFile("./data/responses.json", (error, data) => {
        if(error){
            return res.status(500).send("Failed to read data file")
        }
        else{
            const responses = JSON.parse(data)
            responses.push(newResponse)
            
            //writing all to same file
            fs.writeFile("./data/responses.json", JSON.stringify(responses, null, 2), "utf-8", (err) => {
                if (err) {
                    return res.status(500).send("Failed to write to data file")
                } else {
                    return res.status(200).send(newId)
                }
            });
        }
    })  
})


router.delete('/:id', (req, res) => {
    fs.readFile("./data/responses.json", (error, data) => {
        if(error){
            return res.status(500).send("Failed to read data file")
        }
        else{
            const responses = JSON.parse(data)
            if(responses.length > 0) {
                if(responses.find(r => r.id === req.params.id)) {
                    const updatedResponses = responses.filter(r => r.id !== req.params.id);
                
                    //writing all to same file
                    fs.writeFile("./data/responses.json", JSON.stringify(updatedResponses, null, 2), "utf-8", (err) => {
                        if (err) {
                            return res.status(500).send("Failed to write to data file")
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


router.patch('/:id', (req, res) => {
    //validating the body using joi
    const {error, value} = updateRatingSchema.validate(req.body, { abortEarly: false });     //result obj destructured for result.error and result.value

    if(error){
        const messages = error.details.map(err => err.message).join(", ");
        return res.status(400).send(messages)
    }

    fs.readFile("./data/responses.json", (error, data) => {
        if(error){
            return res.status(500).send("Failed to read data file")
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
                            return res.status(500).send("Failed to write to data file")
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


module.exports = router;