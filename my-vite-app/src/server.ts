import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, './.env') });

const app = express();

app.use(cors());
app.use(express.json());

console.log('Current directory:', __dirname);
console.log('API Key exists:', !!process.env.VITE_OPENAI_API_KEY);

if (!process.env.VITE_OPENAI_API_KEY) {
  throw new Error('VITE_OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

// default words as fallback
let words = [
  "Apple", "Banana", "Cherry", "Date",
  "Elephant", "Falcon", "Giraffe", "Horse",
  "Test1", "Test2", "Test3", "Test4",
  "Test5", "Test6", "Test7", "Test8"
];

app.get('/api/words', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content:
          "Generate a list of 16 random, interesting single words, no more than 12 characters each. You can include characters or celebrities, but stick to more basic words than non-basic words. Whatever words you think of first, throw out, and think of new ones 2 to 7 more times. Separate each word with a comma, and do not include any punctuation beyond the commas."
        }
      ],
      model: "gpt-4o",
    });

    const response = completion.choices[0].message.content;
    if (response) {
      words = response.split(',').map(word => word.trim());
      console.log("New words fetched:", words);
      res.json(words);
    } else {
      console.log("Using default words");
      res.json(words);
    }
  } catch (error) {
    console.error("Error fetching words from OpenAI:", error);
    res.json(words); // Fallback to default words if API fails
  }
});

app.post('/api/submit', async (req, res) => {
  const { words } = req.body;
  console.log("Submitted words:", words);
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content:
          "Pretend you are the New York Times Connections game - give me the category of these four words: " + words + ". Respond with just the category, no explanation or other text."
        }
      ],
      model: "gpt-4o",
    });

    const response = completion.choices[0].message.content;
    console.log("Category:", response);
    res.json({ success: true, category: response });
  } catch (error) {
    console.error("Error fetching category from OpenAI:", error);
    res.json({ success: false, category: "Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});