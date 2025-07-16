const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Import the MCP server functionality
const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Health check endpoint
app.get('/api/huggingface/health', (req, res) => {
    res.json({ status: 'ok', message: 'Hugging Face MCP is running' });
});

// Text generation endpoint
app.post('/api/huggingface/generate_text', async (req, res) => {
    try {
        const { prompt, model = 'gpt2', max_length = 100 } = req.body;
        
        const result = await hf.textGeneration({
            model: model,
            inputs: prompt,
            parameters: {
                max_new_tokens: max_length,
                temperature: 0.7,
                top_p: 0.9,
            },
        });
        
        res.json({ text: result.generated_text });
    } catch (error) {
        console.error('Error generating text:', error);
        res.status(500).json({ error: error.message });
    }
});

// Sentiment analysis endpoint
app.post('/api/huggingface/analyze_sentiment', async (req, res) => {
    try {
        const { text, model = 'cardiffnlp/twitter-roberta-base-sentiment-latest' } = req.body;
        
        const sentiment = await hf.textClassification({
            model: model,
            inputs: text,
        });
        
        res.json({ sentiment });
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        res.status(500).json({ error: error.message });
    }
});

// Text summarization endpoint
app.post('/api/huggingface/summarize_text', async (req, res) => {
    try {
        const { text, model = 'facebook/bart-large-cnn' } = req.body;
        
        const summary = await hf.summarization({
            model: model,
            inputs: text,
            parameters: {
                max_length: 130,
                min_length: 30,
            },
        });
        
        res.json({ summary: summary.summary_text });
    } catch (error) {
        console.error('Error summarizing text:', error);
        res.status(500).json({ error: error.message });
    }
});

// Hashtag generation endpoint
app.post('/api/huggingface/generate_hashtags', async (req, res) => {
    try {
        const { content, model = 'gpt2' } = req.body;
        
        const hashtagPrompt = `Generate relevant hashtags for this social media post: "${content}"\n\nHashtags:`;
        const result = await hf.textGeneration({
            model: model,
            inputs: hashtagPrompt,
            parameters: {
                max_new_tokens: 50,
                temperature: 0.8,
            },
        });
        
        res.json({ hashtags: result.generated_text });
    } catch (error) {
        console.error('Error generating hashtags:', error);
        res.status(500).json({ error: error.message });
    }
});

// Post content suggestion endpoint
app.post('/api/huggingface/suggest_post_content', async (req, res) => {
    try {
        const { topic, platform, model = 'gpt2' } = req.body;
        
        const postPrompt = `Write a ${platform} post about: ${topic}\n\nPost:`;
        const result = await hf.textGeneration({
            model: model,
            inputs: postPrompt,
            parameters: {
                max_new_tokens: 200,
                temperature: 0.9,
            },
        });
        
        res.json({ content: result.generated_text });
    } catch (error) {
        console.error('Error suggesting post content:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve the main dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Dashboard server running on http://localhost:${PORT}`);
    console.log(`🤖 Hugging Face MCP API available at http://localhost:${PORT}/api/huggingface`);
    
    if (!process.env.HUGGINGFACE_API_KEY) {
        console.warn('⚠️  HUGGINGFACE_API_KEY not set. AI features will not work.');
        console.log('📝 Please set your Hugging Face API key in a .env file:');
        console.log('   HUGGINGFACE_API_KEY=your_api_key_here');
    } else {
        console.log('✅ Hugging Face API key configured');
    }
}); 