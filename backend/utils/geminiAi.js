import "dotenv/config";

const getGeminiAPIResponse = async (message) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: message }]
      }]
    })
  };

  try {
    const startTime = performance.now();

    const response = await fetch(url, options);
    const data = await response.json();

    const endTime = performance.now();
    const latencyInSeconds = ((endTime - startTime) / 1000).toFixed(2);

    console.log("--- GOOGLE API RESPONSE STRUCTURE ---");
    console.dir(data, { depth: null });
    console.log(`>>> Response Latency: ${latencyInSeconds} seconds <<<`);
    console.log("-------------------------------------");

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    if (data.candidates?.[0]?.output?.text) {
      return data.candidates[0].output.text;
    }

    if (data.error) {
      return `API Error: ${data.error.message || "Unknown API issue"}`;
    }

    return "Sorry, I couldn't parse the API response layout.";

  } catch (err) {
    console.log("Gemini API Fetch Error:", err);
    return "Sorry, an error occurred while connecting to the AI.";
  }
};

export default getGeminiAPIResponse;