const express = require("express");
const cors = require("cors");
const openai = require("openai");

openai.apiKey = "your_openai_api_key_here";

const app = express();
app.use(cors());
app.use(express.json());

async function generateResponse(prompt, role) {
    const response = await openai.Completion.create({
        engine: "text-davinci-codex-002",
        prompt: `${role}: ${prompt}`,
        temperature: 0.2,
        max_tokens: 100,
        n: 1,
        stop: null,
      });
    
      return response.choices[0].text.trim();
}

// Create an endpoint to handle code generation requests
app.post("/generate", async (req, res) => {
    const initialPrompt = req.body.initialPrompt;
  
    try {
      // Writing agent
      const code = await generateResponse(initialPrompt, "you are a professional programmer, and you will code anything I ask you.");
      
      // Diagnostics agent
      const diagnostics = await generateResponse(code, "you are a professional code reviewer, and you will review the code for errors and improvements.");
      
      // Execution agent
      const execution = await generateResponse(diagnostics, "you are a professional code executor, and you will execute the requests from the diagnostics agent.");
  
      res.json({ code, diagnostics, execution });
    } catch (error) {
      console.error("Error generating code:", error);
      res.status(500).json({ error: "Error generating code" });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

