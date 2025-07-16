# Hugging Face MCP Setup Guide

This guide will help you set up the Hugging Face Model Context Protocol (MCP) integration for your Rutgers University Social Media Management Dashboard.

## 🚀 Quick Start

### 1. Get Your Hugging Face API Key

1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Click "New token"
3. Give it a name (e.g., "Dashboard MCP")
4. Select "Read" permissions
5. Copy the generated token

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Copy the example file
cp env.example .env

# Edit the .env file and add your API key
HUGGINGFACE_API_KEY=x
PORT=3000
NODE_ENV=development
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
# Start the dashboard with MCP integration
npm start

# Or for development with auto-restart
npm run dev:server
```

The dashboard will be available at `http://localhost:3000`

## 🤖 Available AI Features

### Text Generation
- Generate creative content for social media posts
- Use different models like GPT-2, BERT, etc.

### Sentiment Analysis
- Analyze the sentiment of text content
- Perfect for monitoring social media mentions

### Hashtag Generation
- Automatically generate relevant hashtags
- Optimize post reach and discoverability

### Post Content Suggestions
- Get AI-powered post suggestions based on topics
- Tailored for different social media platforms

### Text Summarization
- Summarize long content for social media
- Create concise, engaging posts

## 📁 Project Structure

```
dashboard-test/
├── mcp-config.json          # MCP configuration
├── mcp-server.js           # MCP server implementation
├── server.js               # Express server with API endpoints
├── static/js/
│   └── huggingface-mcp.js  # Client-side MCP integration
├── .env                    # Environment variables (create this)
└── env.example            # Environment template
```

## 🔧 API Endpoints

The server provides these REST endpoints:

- `GET /api/huggingface/health` - Health check
- `POST /api/huggingface/generate_text` - Generate text
- `POST /api/huggingface/analyze_sentiment` - Analyze sentiment
- `POST /api/huggingface/summarize_text` - Summarize text
- `POST /api/huggingface/generate_hashtags` - Generate hashtags
- `POST /api/huggingface/suggest_post_content` - Suggest post content

## 🎯 Usage Examples

### Generate Post Content
```javascript
// Using the client-side API
const content = await hfMCP.suggestPostContent(
    "Rutgers University campus life", 
    "Instagram"
);
console.log(content);
```

### Analyze Sentiment
```javascript
const sentiment = await hfMCP.analyzeSentiment(
    "I love the new campus facilities!"
);
console.log(sentiment);
```

### Generate Hashtags
```javascript
const hashtags = await hfMCP.generateHashtags(
    "Join us for the Rutgers football game this weekend!"
);
console.log(hashtags);
```

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Keep your Hugging Face API key secure
- The API key is only used server-side
- All API calls are proxied through your Express server

## 🛠️ Troubleshooting

### Common Issues

1. **"Hugging Face MCP not connected"**
   - Check if the server is running
   - Verify your API key is set correctly
   - Check browser console for errors

2. **API rate limits**
   - Hugging Face has rate limits on free accounts
   - Consider upgrading for higher limits

3. **Model not found errors**
   - Some models may require authentication
   - Check model names are correct

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

## 📚 Additional Resources

- [Hugging Face Inference API](https://huggingface.co/docs/api-inference)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

To add new AI features:

1. Add the tool to `mcp-server.js`
2. Create corresponding API endpoint in `server.js`
3. Add client-side method in `huggingface-mcp.js`
4. Update this documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 