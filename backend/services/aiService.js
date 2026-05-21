const { OpenAI } = require('openai');

class AIService {
  constructor() {
    this.openai = null;
  }

  getClient() {
    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey: process.env.MODEL_API_KEY,
      });
    }
    return this.openai;
  }

  async extractItineraryFromText(text) {
    const response = await this.getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a travel assistant that extracts itinerary details from booking documents. You must respond with a JSON object.',
        },
        {
          role: 'user',
          content: `Extract the travel details from this text and format as a JSON object matching this schema:
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
${text}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async extractItineraryFromImage(base64Image, mimeType) {
    const response = await this.getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a travel assistant that extracts itinerary details from booking documents. You must respond with a JSON object.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Extract the travel details from this image and format as a JSON object matching this schema:
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
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

module.exports = new AIService();
