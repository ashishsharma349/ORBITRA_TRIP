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
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

class GeminiService {
  async executeWithFallback(payloadBuilder) {
    const apiKey = process.env.MODEL_API_KEY;
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro'];
    let lastError;

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      try {
        const payload = payloadBuilder();
        const res = await fetchWithRetry(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = `Gemini API error: ${res.statusText} ${JSON.stringify(errData)}`;
          if (res.status === 429) {
            lastError = new Error(errMsg);
            continue;
          }
          throw new Error(errMsg);
        }

        const data = await res.json();
        const contentText = data.candidates[0].content.parts[0].text;
        return JSON.parse(contentText);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error('All models failed');
  }

  async extractItineraryFromText(text) {
    const prompt = `You are a travel assistant that extracts itinerary details from booking documents.
Analyze the text and determine if it contains valid travel-related booking details (such as flight tickets, hotel reservations, train tickets, or activities).
Format the output as a JSON object matching this schema:
{
  "isValidTravelDocument": true,
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

If the document does not contain valid travel booking or ticket information (e.g. it is a textbook page, a syllabus, random text, or unrelated document), you MUST return a JSON object with this specific structure:
{
  "isValidTravelDocument": false,
  "garbageReason": "A brief explanation of the unrelated content detected (e.g., 'college syllabus detected')"
}

Text to analyze:
${text}`;

    return this.executeWithFallback(() => ({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    }));
  }

  async extractItineraryFromImage(base64Image, mimeType) {
    const prompt = `You are a travel assistant that extracts itinerary details from booking documents.
Analyze the image and determine if it contains valid travel-related booking details (such as flight tickets, hotel reservations, train tickets, or activities).
Format the output as a JSON object matching this schema:
{
  "isValidTravelDocument": true,
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

If the document does not contain valid travel booking or ticket information (e.g. it is a textbook page, a syllabus, random text, or unrelated document), you MUST return a JSON object with this specific structure:
{
  "isValidTravelDocument": false,
  "garbageReason": "A brief explanation of the unrelated content detected (e.g., 'unrelated image detected')"
}`;

    return this.executeWithFallback(() => ({
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
    }));
  }
}

module.exports = new GeminiService();
