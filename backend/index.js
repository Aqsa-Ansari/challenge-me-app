const express = require("express");
const cors = require("cors");
require("dotenv").config();

const challengeRoutes = require("./routes/challenges");
const responseRoutes = require("./routes/responses");

const app = express();
app.use(express.json());

const allowedOrigins = [
  process.env.ALLOWED_ORIGIN_LOCALHOST,
  process.env.ALLOWED_ORIGIN_IP,
  process.env.ALLOWED_ORIGIN_DEPLOYED,
  "http://127.0.0.1:5500"
].filter(Boolean); // remove any undefined ones

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow
    } else {
      callback(new Error("Not allowed by CORS")); // deny
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));


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