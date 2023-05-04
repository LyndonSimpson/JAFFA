const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

async function generateResponse(prompt, role) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",                       // must try out turbo 3.5 and different temperatures, right now only code appears,
    prompt: `${role}. ${prompt}`,                    // wich isn't bad but sometimes would be nice to have the changes commented.
    max_tokens: 1000,
    temperature: 0,
  });
  console;console.log(response);
  return response.data.choices[0].text.trim();
}

// Create an endpoint to handle code generation requests
app.post("/generate", async (req, res) => {
  const initialPrompt = req.body.initialPrompt;

  try {
    // Writing agent
    const code = await generateResponse(initialPrompt, "you are a professional programmer, and you will code anything I ask you.");

    // Diagnostics agent
    const diagnostics = await generateResponse(code, "you are a professional code reviewer, and you will review the code for errors and imprrovements, and rewrite it!.");

    // Execution agent
    const execution = await generateResponse(diagnostics, "you are a professional code executor, and you will execute improovements on the code given. If you don't understand just say : i don't understand");

    res.json({ code, diagnostics, execution });
  } catch (error) {
    console.error("Error generating code:", error);
    res.status(500).json({ error: `Error generating code: ${error.message}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


