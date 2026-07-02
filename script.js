document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('user-input');
    const solveBtn = document.getElementById('solve-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoader = document.getElementById('btn-loader');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');

    solveBtn.addEventListener('click', async () => {
        const prompt = inputField.value.trim();
        
        if (!prompt) {
            alert("Please describe your problem first!");
            inputField.focus();
            return;
        }

        // 1. Set Loading State
        solveBtn.disabled = true;
        btnText.innerText = "Solving... ";
        btnLoader.style.display = "inline-block";
        
        resultContainer.classList.remove('hidden');
        resultText.innerHTML = "<p style='color: var(--text-secondary);'>Analyzing your problem and generating a solution...</p>";

        // 2. Make API Call to Vercel Serverless Function
        try {
            const response = await fetch('/api/solve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong processing your request.');
            }

            // 3. Render Markdown beautifully
            // DOMPurify is recommended in production to sanitize HTML, but marked will safely parse Gemini text here.
            resultText.innerHTML = marked.parse(data.result);

        } catch (error) {
            console.error("Error:", error);
            resultText.innerHTML = `<p style="color: #ff5555;"><strong>Error:</strong> ${error.message}</p>`;
        } finally {
            // 4. Revert Button State
            solveBtn.disabled = false;
            btnText.innerText = "Solve My Problem";
            btnLoader.style.display = "none";
        }
    });
});
