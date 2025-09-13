
import type { NextApiRequest, NextApiResponse } from 'next';
import ai, { geminiModel } from '../../../lib/gemini';
import { Content } from '@google/genai';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { messages } = req.body as { messages: Message[] };

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: 'Invalid message history provided.' });
  }

  const systemInstruction = `You are a friendly and helpful troubleshooting assistant for a VPN application called "Mango VPN Connect". Your goal is to help users solve their connection problems.
    Keep your responses concise and easy to follow. You can suggest common fixes like:
    1. Checking their internet connection.
    2. Restarting the Mango VPN Connect app.
    3. Trying to connect to a different server.
    4. Checking if a firewall or antivirus is blocking the connection.
    Do not suggest contacting support unless the user has tried all other options. You are an AI and should identify yourself as the "Mango VPN Connect Assistant".`;

  const contents: Content[] = messages.map((msg): Content => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  try {
    const result = await ai.models.generateContentStream({
        model: geminiModel,
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Connection': 'keep-alive'
    });

    for await (const chunk of result) {
      res.write(chunk.text);
    }
    res.end();

  } catch (error) {
    console.error('Gemini API stream error:', error);
    // Cannot send a JSON error response after headers are sent
    res.end('Error: Failed to get a response from the AI assistant.');
  }
}
