const express = require('express');
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
const allowedOrigins = ['http://localhost:3000', 'https://www.makestory.me', 'https://story-book-generator-kappa.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const model = process.env.AZURE_OPENAI_MODEL;

if (!endpoint || !apiKey || !model) {
    console.error("Missing required environment variables. Please check your .env file.");
    process.exit(1);
}

app.post('/api/generateStory', async (req, res) => {
    const { storyData, userInput } = req.body;

    let prompt = `You are an interactive storytelling assistant. You help users continue their stories by suggesting the next line and involving them in the story with dialogs, questions, and suspenseful elements. Your goal is to make the story feel immersive and interactive, keeping the user engaged. Use the input and context provided to generate a response that seamlessly continues the story.

Example interactions:
User Input: I was sitting in class when I first saw it. Miss Weaver's voice droned on, but my attention was drawn to a flicker of movement outside the window.
Assistant Response: The flicker of movement outside the window caught your eye again. This time, it was unmistakable—a shadowy figure darting between the trees. 'Did you see that?' you whispered to your classmate, nudging them with your elbow. What do you want to do next? Do you want to ignore it and focus back on the lesson, or do you want to ask Miss Weaver if you can go outside? (ignore/ask)

User Input: ask
Assistant Response: You raised your hand, your heart pounding. 'Miss Weaver, may I go to the bathroom?' you asked, trying to keep your voice steady. She gave a reluctant nod. As you stepped into the hallway, you glanced back at the window. The shadowy figure was still there, watching you. Do you want to go straight outside or find a friend to come with you? (outside/friend)

Now continue the story based on the following context:
Context: ${storyData.map(entry => `${entry.role}: ${entry.content}`).join('\n')}
Continue the story in an engaging and interactive manner, providing responses that are no more than 3 sentences long. Provide options for the user to choose from at the end of the response where appropriate. Wait for the user to input the option to move forward with the story, Do not write after the options.`;

    if (userInput) {
        prompt += `\nUser Input: ${userInput}\nAssistant Response:`;
    }

    try {
        const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
        const result = await client.getChatCompletions(model, [prompt], { maxTokens: 150, temperature: 0.7, topP: 1, frequencyPenalty: 0.5, presencePenalty: 0.5 });
        const newResponse = result.choices[0]?.text.trim();
        res.json({ newResponse });
    } catch (err) {
        console.error("Error generating story:", err.message || err);
        res.status(500).json({ error: "Failed to generate story" });
    }
});

app.post('/api/generateImage', async (req, res) => {
    const { prompt } = req.body;
    const size = "1024x1024";
    const n = 1;

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
    const deploymentName = "dall-e-3"; // Make sure this matches your deployment

    try {
        const results = await client.getImages(deploymentName, prompt, { n, size });
        const imageUrls = results.data.map(image => image.url);
        res.json({ images: imageUrls });
    } catch (err) {
        console.error("Error generating image:", err.message || err);
        res.status(500).json({ error: "Failed to generate image" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
