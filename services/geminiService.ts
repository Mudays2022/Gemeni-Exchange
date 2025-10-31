
import { GoogleGenAI } from "@google/genai";

export const getMarketAnalysis = async (pair: string, price: number, change: number): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are a savvy, professional cryptocurrency market analyst providing insights for a simulated trading dashboard.
      Your analysis should be concise, insightful, and use common trading terminology (e.g., support, resistance, bullish, bearish, volatility, momentum).
      Do not give financial advice. Frame your response as an observation of simulated market conditions.

      Analyze the current situation for the trading pair: ${pair}.
      - Current Price: $${price.toFixed(2)}
      - 24h Change: ${change.toFixed(2)}%

      Provide a one-paragraph technical analysis based on this information.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error fetching market analysis from Gemini API:", error);
    if (error instanceof Error) {
        return `Failed to retrieve AI analysis: ${error.message}. Please check your Gemini API key and configuration.`;
    }
    return "An unknown error occurred while fetching AI analysis.";
  }
};

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export const getAIChatResponse = async (history: ChatMessage[], question: string, marketContext: { pair: string, price: string }): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
          throw new Error("API_KEY environment variable not set");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = `You are a helpful and knowledgeable cryptocurrency trading assistant named 'Gem'.
        - Your goal is to provide educational and insightful information about trading concepts, market analysis, and the specific assets being discussed.
        - You must not give financial advice. Never tell the user to buy, sell, or hold any asset.
        - Use the provided market context to answer questions relevantly.
        - Keep your answers concise and easy to understand.`;

        const contents = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));
        
        // Add the current market context and the new question
        contents.push({
            role: 'user',
            parts: [{ text: `(Current Market Context: ${marketContext.pair} at $${marketContext.price}) \n\nMy question is: ${question}` }]
        });
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction,
          }
        });

        return response.text;

    } catch (error) {
        console.error("Error fetching chat response from Gemini API:", error);
        if (error instanceof Error) {
            return `Sorry, I encountered an error: ${error.message}.`;
        }
        return "Sorry, I'm unable to respond at the moment.";
    }
};
