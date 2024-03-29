import type { NextApiRequest, NextApiResponse } from 'next';
import {OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { request_message} = req.body;

    try {
      
      const completion = await  openai.chat.completions.create({
        model: 'gpt-3.5-turbo-1106',
        messages: request_message,
      });

      if (completion && completion.choices && completion.choices.length > 0&&
        completion.choices[0].message.content) {
        console.log(completion.choices);
        res.status(200).json({ answer: completion.choices[0].message.content.trim()});
      } else {
        res.status(400).json({ error: 'No response from the ChatGPT API', details: completion });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error connecting to the ChatGPT API', details: error });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
