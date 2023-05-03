document.addEventListener("DOMContentLoaded", () => {
    const generateButton = document.getElementById("generate");
    const promptInput = document.getElementById("prompt");
    const outputDiv = document.getElementById("output");
  
    generateButton.addEventListener("click", async () => {
      const initialPrompt = promptInput.value;
      if (!initialPrompt) return;
  
      // Call your JAFFA project API to generate code
      try {
        const response = await axios.post("http://localhost:3000/generate", {
          initialPrompt,
        });
  
        // Inject the generated code into a new div
        const codeDiv = document.createElement("div");
        codeDiv.textContent = response.data.code;
        outputDiv.appendChild(codeDiv);
      } catch (error) {
        console.error("Error generating code:", error);
      }
    });
  });
  