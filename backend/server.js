const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

const API_KEY = "AIzaSyAsqW4Ej49AdkLB2KETpCLk9lp0VIgBKjA";
const BASE_URL = "https://chromeuxreport.googleapis.com/v1/records:queryRecord";
app.use(cors());
app.use(bodyParser.json());

app.post("/api/report", async (req, res) => {
  const { url } = req.body;
  const requestBody = {
    origin: url,
  };

  try {
    const response = await axios.post(
      `${BASE_URL}?key=${API_KEY}`,
      requestBody
    );
    res.json({ url, metrics: response.data });
  } catch (error) {
    res.status(500).json({ error: "Error fetching Chrome UX Report" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
