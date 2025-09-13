import type { NextApiRequest, NextApiResponse } from 'next';
import ai, { geminiModel } from '../../../lib/gemini';
import { Server } from '../../../types/client';
import { Type } from '@google/genai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { query, servers } = req.body as { query: string; servers: Server[] };

  if (!query || !servers || servers.length === 0) {
    return res.status(400).json({ message: 'Query and server list are required.' });
  }

  try {
    const serverListText = servers.map(s => `ID: ${s.id}, Country: ${s.country}, City: ${s.city}`).join('\n');
    
    const prompt = `
      You are an intelligent VPN server recommender. Based on the user's request, choose the best server from the following list.
      Respond only with the JSON object containing the ID of the best server. Do not add any other text or explanations.

      User Request: "${query}"

      Available Servers:
      ${serverListText}
    `;

    const result = await ai.models.generateContent({
        model: geminiModel,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                serverId: {
                    type: Type.INTEGER,
                    description: "The ID of the recommended server."
                }
            }
          }
        }
    });
    
    const responseText = result.text.trim();
    const responseJson = JSON.parse(responseText);

    const recommendedId = responseJson.serverId;

    if (recommendedId && servers.some(s => s.id === recommendedId)) {
        res.status(200).json({ serverId: recommendedId });
    } else {
        res.status(404).json({ message: "Could not find a suitable server for your request." });
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ message: 'Error processing your request with the AI model.' });
  }
}