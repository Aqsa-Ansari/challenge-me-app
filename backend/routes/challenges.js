const express = require("express");
const fs = require("fs");
const router = express.Router();

const { pickRandom } = require("../utils/pickRandom");

// GET    /api/challenges/random           → Get a random challenge


router.get('/random', (req, res) => {
    //reading and parsing all challenges from the json file
    fs.readFile("./data/challenges.json", (error, data) => {
        if(error){
           return res.status(500).send("Can't read data file")      //return to the rest is not executed
        }
        else {
            const challenges = JSON.parse(data);

            if(challenges.length > 0){
                const randomChallenge = pickRandom(challenges);
                return res.status(200).send(randomChallenge)
            }
            else {
                return res.status(404).send("No challenge found")
            }
        }
    })
})

module.exports = router;
