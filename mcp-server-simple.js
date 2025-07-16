#!/usr/bin/env node

const { HfInference } = require('@huggingface/inference');

// Simple MCP server for Hugging Face
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Read from stdin, write to stdout
process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');

let buffer = '';

process.stdin.on('data', async (chunk) => {
  buffer += chunk;
  
  try {
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete line in buffer
    
    for (const line of lines) {
      if (line.trim()) {
        const request = JSON.parse(line);
        await handleRequest(request);
      }
    }
  } catch (error) {
    console.error('Error processing request:', error);
  }
});

async function handleRequest(request) {
  try {
    switch (request.method) {
      case 'initialize':
        sendResponse(request.id, {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'huggingface-mcp',
            version: '1.0.0'
          }
        });
        break;
        
      case 'tools/list':
        sendResponse(request.id, {
          tools: [
            {
              name: 'generate_text',
              description: 'Generate text using Hugging Face models',
              inputSchema: {
                type: 'object',
                properties: {
                  prompt: { type: 'string' },
                  model: { type: 'string', default: 'gpt2' },
                  max_length: { type: 'number', default: 100 }
                },
                required: ['prompt']
              }
            },
            {
              name: 'analyze_sentiment',
              description: 'Analyze sentiment of text',
              inputSchema: {
                type: 'object',
                properties: {
                  text: { type: 'string' }
                },
                required: ['text']
              }
            },
            {
              name: 'generate_hashtags',
              description: 'Generate hashtags for social media content',
              inputSchema: {
                type: 'object',
                properties: {
                  content: { type: 'string' }
                },
                required: ['content']
              }
            }
          ]
        });
        break;
        
      case 'tools/call':
        const { name, arguments: args } = request.params;
        let result;
        
        switch (name) {
          case 'generate_text':
            result = await hf.textGeneration({
              model: args.model || 'gpt2',
              inputs: args.prompt,
              parameters: {
                max_new_tokens: args.max_length || 100,
                temperature: 0.7
              }
            });
            break;
            
          case 'analyze_sentiment':
            result = await hf.textClassification({
              model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
              inputs: args.text
            });
            break;
            
          case 'generate_hashtags':
            const prompt = `Generate hashtags for: "${args.content}"\n\nHashtags:`;
            result = await hf.textGeneration({
              model: 'gpt2',
              inputs: prompt,
              parameters: {
                max_new_tokens: 50,
                temperature: 0.8
              }
            });
            break;
            
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
        
        sendResponse(request.id, {
          content: [
            {
              type: 'text',
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
            }
          ]
        });
        break;
        
      default:
        sendResponse(request.id, { error: `Unknown method: ${request.method}` });
    }
  } catch (error) {
    sendResponse(request.id, { error: error.message });
  }
}

function sendResponse(id, result) {
  const response = {
    jsonrpc: '2.0',
    id,
    result
  };
  process.stdout.write(JSON.stringify(response) + '\n');
}

// Handle shutdown gracefully
process.on('SIGINT', () => {
  process.exit(0);
}); 