import type { NextApiResponse } from 'next';
import { protect, NextApiRequestWithUser } from '../../../middleware/auth';
import connectDB from '../../../utils/db';
import Log from '../../../models/Log';
import { logger } from '../../../utils/logger';
import ai, { geminiModel } from '../../../lib/gemini';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectDB();
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Query is required.' });
  }

  try {
    const prompt = `
        You are an expert at converting natural language questions about logs into JSON filters for a MongoDB query.
        The available log fields are 'level' (enum: 'info', 'warn', 'error', 'debug'), 'message' (string), 'source' (string), and 'timestamp' (ISO date string).
        
        - For text searches on 'message', use a case-insensitive regex ($regex and $options: 'i').
        - For time-based queries, use MongoDB date query operators like '$gte' (greater than or equal to) and '$lt' (less than).
        - Assume the current date is ${new Date().toISOString()}.
        - Respond ONLY with the JSON filter object. Do not add explanations or markdown.

        Examples:
        - User: "show all errors from the vpn server" -> {"level":"error","source":"vpn-server"}
        - User: "failed login attempts" -> {"message":{"$regex":"failed login","$options":"i"}}
        - User: "logs from yesterday" -> {"timestamp":{"$gte":"YYYY-MM-DDTHH:mm:ss.sssZ","$lt":"YYYY-MM-DDTHH:mm:ss.sssZ"}}
        - User: "info logs in the last hour" -> {"level":"info","timestamp":{"$gte":"YYYY-MM-DDTHH:mm:ss.sssZ"}}

        User's query: "${query}"
    `;

    const result = await ai.models.generateContent({
        model: geminiModel,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json'
        }
    });

    const responseText = result.text.trim();
    let filter = JSON.parse(responseText);

    // Sanitize date fields
    if (filter.timestamp) {
        if (filter.timestamp.$gte) filter.timestamp.$gte = new Date(filter.timestamp.$gte);
        if (filter.timestamp.$lt) filter.timestamp.$lt = new Date(filter.timestamp.$lt);
    }
    
    const logs = await Log.find(filter).sort({ timestamp: -1 }).limit(200);

    const formattedLogs = logs.map(log => ({
        id: log._id.toString(),
        timestamp: log.timestamp.toISOString(),
        level: log.level,
        message: log.message,
        source: log.source,
        userId: log.userId?.toString(),
    }));

    res.status(200).json(formattedLogs);

  } catch (error) {
    logger.error('AI Log Query Failed:', error);
    res.status(500).json({ message: 'Failed to process AI log query.' });
  }
}

export default protect({
  POST: ['viewer', 'editor', 'administrator'],
})(handler);
