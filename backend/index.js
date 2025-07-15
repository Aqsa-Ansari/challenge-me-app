const express = require("express");
require("dotenv").config();

const challengeRoutes = require("./routes/challenges");
const responseRoutes = require("./routes/responses");

const app = express();
app.use(express.json());

// GET    /api/challenges/random           → Get a random challenge
// GET    /api/responses/:challengeId    → Get responses for a specific challenge
// POST   /api/responses                   → Add a new response
// DELETE /api/responses/:id               → Delete a response by ID
// PATCH  /api/responses/:id               → Update a response (e.g. rating)


app.get('/', (req, res) => {
  res.send('challenge me app is up')
})


app.use("/api/challenges", challengeRoutes);
app.use("/api/responses", responseRoutes);


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on ${port}...`))