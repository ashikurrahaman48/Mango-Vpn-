import type { NextApiResponse } from 'next';
import { protect, NextApiRequestWithUser } from '../../../middleware/auth';
import connectDB from '../../../utils/db';
import Log from '../../../models/Log';
import { logger } from '../../../utils/logger';
import ai, { geminiModel } from '../../../lib/gemini';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectDB();

  try {
    // Fetch recent critical logs (e.g., last 24 hours, 100 entries max)
    const recentLogs = await Log.find({
      level: { $in: ['warn', 'error'] },
      timestamp: { $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) }
    })
    .sort({ timestamp: -1 })
    .limit(100)
    .lean();

    if (recentLogs.length === 0) {
      return res.status(200).json({ report: "No significant security events found in the last 24 hours. The system appears to be operating normally." });
    }

    const logSummary = recentLogs.map(log => 
      `${log.timestamp.toISOString()} [${log.level}] ${log.source}: ${log.message}`
    ).join('\n');

    const prompt = `
        You are an expert cybersecurity analyst for a service called Mango VPN Connect. Your task is to analyze the following security-related logs from the last 24 hours.
        Identify any potential threats, suspicious patterns, or anomalies.
        Provide a brief, easy-to-read summary of your findings. If you find multiple related events, group them.
        If no serious threats are found, state that the system appears stable but mention any minor warnings.
        Your report should be in plain text, using markdown for formatting if needed (e.g., bullet points).

        Log Data:
        ---
        ${logSummary}
        ---
    `;

    const result = await ai.models.generateContent({
        model: geminiModel,
        contents: [{ parts: [{ text: prompt }] }],
    });

    res.status(200).json({ report: result.text });

  } catch (error) {
    logger.error('AI Security Analysis Failed:', error);
    res.status(500).json({ message: 'Failed to generate security report.' });
  }
}

export default protect({
  GET: ['administrator'],
})(handler);
