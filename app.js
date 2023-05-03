const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "your_openai_api_key_here", // use dotenv
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

async function generateResponse(prompt, role) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: role,
        content: prompt,
      },
    ],
  });

  return response.data.choices[0].message.content.trim();
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
    res.status(500).json({ error: `Error generating code: ${error.message}` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


