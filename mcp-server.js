#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { HfInference } = require('@huggingface/inference');

const server = new Server(
  {
    name: 'huggingface-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Define tools
const tools = [
  {
    name: 'generate_text',
    description: 'Generate text using Hugging Face models',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The text prompt to generate from',
        },
        model: {
          type: 'string',
          description: 'The Hugging Face model to use (default: gpt2)',
        },
        max_length: {
          type: 'number',
          description: 'Maximum length of generated text (default: 100)',
        },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'analyze_sentiment',
    description: 'Analyze sentiment of text using Hugging Face models',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to analyze',
        },
        model: {
          type: 'string',
          description: 'The sentiment analysis model to use',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'summarize_text',
    description: 'Summarize text using Hugging Face models',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to summarize',
        },
        model: {
          type: 'string',
          description: 'The summarization model to use',
        },
      },
      required: ['text'],
    },
  },
  {
    name: 'generate_hashtags',
    description: 'Generate relevant hashtags for social media content',
    inputSchema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'The social media content to generate hashtags for',
        },
        model: {
          type: 'string',
          description: 'The model to use for generation',
        },
      },
      required: ['content'],
    },
  },
  {
    name: 'suggest_post_content',
    description: 'Suggest social media post content based on a topic',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'The topic to write about',
        },
        platform: {
          type: 'string',
          description: 'The social media platform (Instagram, Facebook, Twitter, etc.)',
        },
        model: {
          type: 'string',
          description: 'The model to use for generation',
        },
      },
      required: ['topic', 'platform'],
    },
  },
];

// List available tools
server.setRequestHandler('tools/list', async () => {
  return {
    tools: tools,
  };
});

// Handle tool calls
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'generate_text':
        const { prompt, model = 'gpt2', max_length = 100 } = args;
        const result = await hf.textGeneration({
          model: model,
          inputs: prompt,
          parameters: {
            max_new_tokens: max_length,
            temperature: 0.7,
            top_p: 0.9,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: result.generated_text,
            },
          ],
        };

      case 'analyze_sentiment':
        const { text, model: sentimentModel = 'cardiffnlp/twitter-roberta-base-sentiment-latest' } = args;
        const sentiment = await hf.textClassification({
          model: sentimentModel,
          inputs: text,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(sentiment, null, 2),
            },
          ],
        };

      case 'summarize_text':
        const { text: textToSummarize, model: summaryModel = 'facebook/bart-large-cnn' } = args;
        const summary = await hf.summarization({
          model: summaryModel,
          inputs: textToSummarize,
          parameters: {
            max_length: 130,
            min_length: 30,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: summary.summary_text,
            },
          ],
        };

      case 'generate_hashtags':
        const { content, model: hashtagModel = 'gpt2' } = args;
        const hashtagPrompt = `Generate relevant hashtags for this social media post: "${content}"\n\nHashtags:`;
        const hashtagResult = await hf.textGeneration({
          model: hashtagModel,
          inputs: hashtagPrompt,
          parameters: {
            max_new_tokens: 50,
            temperature: 0.8,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: hashtagResult.generated_text,
            },
          ],
        };

      case 'suggest_post_content':
        const { topic, platform, model: postModel = 'gpt2' } = args;
        const postPrompt = `Write a ${platform} post about: ${topic}\n\nPost:`;
        const postResult = await hf.textGeneration({
          model: postModel,
          inputs: postPrompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.9,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: postResult.generated_text,
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error('Error in tool call:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

const transport = new StdioServerTransport();
server.connect(transport); 