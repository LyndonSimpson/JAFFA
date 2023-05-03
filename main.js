
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
      
          // Inject the generated code, diagnostics, and execution results into new divs
          const { code, diagnostics, execution } = response.data;
          const codeDiv = document.createElement("div");
          const diagnosticsDiv = document.createElement("div");
          const executionDiv = document.createElement("div");
      
          codeDiv.textContent = `Generated Code:\n${code}`;
          diagnosticsDiv.textContent = `Diagnostics:\n${diagnostics}`;
          executionDiv.textContent = `Execution:\n${execution}`;
      
          outputDiv.appendChild(codeDiv);
          outputDiv.appendChild(diagnosticsDiv);
          outputDiv.appendChild(executionDiv);
        } catch (error) {
          console.error("Error generating code:", error);
        }
      });
  });
  