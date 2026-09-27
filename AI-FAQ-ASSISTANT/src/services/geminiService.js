const { GoogleGenAI } = require('@google/genai');

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in .env file');
  }

  console.log('Gemini API key loaded:', apiKey.substring(0, 8) + '...');

  return new GoogleGenAI({
    apiKey: apiKey
  });
};

const generateAnswer = async (question) => {
  try {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Answer this question clearly and concisely:

${question}`
    });

    if (!response || !response.text) {
      throw new Error('No response text received from Gemini API');
    }

    return response.text.trim();

  } catch (error) {
    console.error('Gemini Error:', error);
    throw new Error(`AI Answer Generation failed: ${error.message}`);
  }
};

const generateFAQ = async (topic) => {
  try {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate one FAQ question and answer about: "${topic}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            question: {
              type: 'STRING'
            },
            answer: {
              type: 'STRING'
            }
          },
          required: ['question', 'answer']
        }
      }
    });

    if (!response || !response.text) {
      throw new Error('No response received from Gemini API');
    }

    return JSON.parse(response.text);

  } catch (error) {
    console.error('Gemini FAQ Error:', error);
    throw new Error(`AI FAQ Generation failed: ${error.message}`);
  }
};

module.exports = {
  generateAnswer,
  generateFAQ
};