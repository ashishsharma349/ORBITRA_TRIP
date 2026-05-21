const fetchWithRetry = async (url, options, maxRetries = 3, initialDelay = 1000) => {
  let delay = initialDelay;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        return res;
      }
      
      const isTransient = res.status === 503 || res.status === 429 || res.status >= 500;
      if (!isTransient || attempt === maxRetries) {
        return res;
      }
      
      console.warn(`Gemini API returned status ${res.status}. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.warn(`Gemini API request failed: ${error.message}. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

class GeminiService {
  async extractItineraryFromText(text) {
    const apiKey = process.env.MODEL_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const prompt = `You are a travel assistant that extracts itinerary details from booking documents.
Extract the travel details from this text and format as a JSON object matching this schema:
{
  "title": "Trip Title",
  "startDate": "YYYY-MM-DD or null",
  "endDate": "YYYY-MM-DD or null",
  "days": [
    {
      "dayNumber": 1,
      "date": "Day 1 or specific date",
      "activities": [
        {
          "time": "Time",
          "type": "flight" | "hotel" | "train" | "activity" | "other",
          "title": "Short title",
          "description": "Details",
          "location": "Location"
        }
      ]
    }
  ]
}

Text to analyze:
${text}`;

    const res = await fetchWithRetry(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${res.statusText} ${JSON.stringify(errData)}`);
    }

    const data = await res.json();
    const contentText = data.candidates[0].content.parts[0].text;
    return JSON.parse(contentText);
  }

  async extractItineraryFromImage(base64Image, mimeType) {
    const apiKey = process.env.MODEL_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const prompt = `You are a travel assistant that extracts itinerary details from booking documents.
Extract the travel details from this image and format as a JSON object matching this schema:
{
  "title": "Trip Title",
  "startDate": "YYYY-MM-DD or null",
  "endDate": "YYYY-MM-DD or null",
  "days": [
    {
      "dayNumber": 1,
      "date": "Day 1 or specific date",
      "activities": [
        {
          "time": "Time",
          "type": "flight" | "hotel" | "train" | "activity" | "other",
          "title": "Short title",
          "description": "Details",
          "location": "Location"
        }
      ]
    }
  ]
}`;

    const res = await fetchWithRetry(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${res.statusText} ${JSON.stringify(errData)}`);
    }

    const data = await res.json();
    const contentText = data.candidates[0].content.parts[0].text;
    return JSON.parse(contentText);
  }
}

module.exports = new GeminiService();
