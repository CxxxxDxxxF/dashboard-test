/**
 * Hugging Face MCP Client Integration
 * Provides AI-powered features for the social media dashboard
 */

class HuggingFaceMCP {
    constructor() {
        this.baseUrl = '/api/huggingface';
        this.isConnected = false;
    }

    /**
     * Initialize the MCP connection
     */
    async initialize() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            this.isConnected = response.ok;
            console.log('Hugging Face MCP:', this.isConnected ? 'Connected' : 'Not available');
            return this.isConnected;
        } catch (error) {
            console.warn('Hugging Face MCP not available:', error.message);
            this.isConnected = false;
            return false;
        }
    }

    /**
     * Generate text using Hugging Face models
     */
    async generateText(prompt, model = 'gpt2', maxLength = 100) {
        if (!this.isConnected) {
            throw new Error('Hugging Face MCP not connected');
        }

        try {
            const response = await fetch(`${this.baseUrl}/generate_text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    model,
                    max_length: maxLength,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.text;
        } catch (error) {
            console.error('Error generating text:', error);
            throw error;
        }
    }

    /**
     * Analyze sentiment of text
     */
    async analyzeSentiment(text, model = 'cardiffnlp/twitter-roberta-base-sentiment-latest') {
        if (!this.isConnected) {
            throw new Error('Hugging Face MCP not connected');
        }

        try {
            const response = await fetch(`${this.baseUrl}/analyze_sentiment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    model,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.sentiment;
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            throw error;
        }
    }

    /**
     * Generate hashtags for social media content
     */
    async generateHashtags(content, model = 'gpt2') {
        if (!this.isConnected) {
            throw new Error('Hugging Face MCP not connected');
        }

        try {
            const response = await fetch(`${this.baseUrl}/generate_hashtags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    model,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.hashtags;
        } catch (error) {
            console.error('Error generating hashtags:', error);
            throw error;
        }
    }

    /**
     * Suggest post content based on topic
     */
    async suggestPostContent(topic, platform, model = 'gpt2') {
        if (!this.isConnected) {
            throw new Error('Hugging Face MCP not connected');
        }

        try {
            const response = await fetch(`${this.baseUrl}/suggest_post_content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    platform,
                    model,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.content;
        } catch (error) {
            console.error('Error suggesting post content:', error);
            throw error;
        }
    }

    /**
     * Summarize text
     */
    async summarizeText(text, model = 'facebook/bart-large-cnn') {
        if (!this.isConnected) {
            throw new Error('Hugging Face MCP not connected');
        }

        try {
            const response = await fetch(`${this.baseUrl}/summarize_text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    model,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.summary;
        } catch (error) {
            console.error('Error summarizing text:', error);
            throw error;
        }
    }
}

// Initialize the Hugging Face MCP client
const hfMCP = new HuggingFaceMCP();

// Export for use in other scripts
window.hfMCP = hfMCP;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await hfMCP.initialize();
    
    // Add AI features to the dashboard
    initializeAIFeatures();
});

/**
 * Initialize AI-powered features in the dashboard
 */
function initializeAIFeatures() {
    // Add AI suggestion button to post composer
    const postComposer = document.querySelector('.post-composer');
    if (postComposer) {
        addAISuggestionButton();
    }

    // Add sentiment analysis to analytics
    const analyticsPage = document.querySelector('.analytics-page');
    if (analyticsPage) {
        addSentimentAnalysis();
    }
}

/**
 * Add AI suggestion button to post composer
 */
function addAISuggestionButton() {
    const textarea = document.querySelector('textarea[placeholder*="What\'s happening"]');
    if (textarea) {
        const aiButton = document.createElement('button');
        aiButton.className = 'btn btn-sm btn-outline btn-primary ml-2';
        aiButton.innerHTML = '<i class="fas fa-magic mr-1"></i>AI Suggest';
        aiButton.onclick = async () => {
            try {
                aiButton.disabled = true;
                aiButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Generating...';
                
                const topic = prompt('What topic would you like to write about?');
                if (topic) {
                    const content = await hfMCP.suggestPostContent(topic, 'Instagram');
                    textarea.value = content;
                    
                    // Generate hashtags
                    const hashtags = await hfMCP.generateHashtags(content);
                    showNotification(`AI generated content and hashtags: ${hashtags}`, 'success');
                }
            } catch (error) {
                showNotification('Error generating AI content: ' + error.message, 'error');
            } finally {
                aiButton.disabled = false;
                aiButton.innerHTML = '<i class="fas fa-magic mr-1"></i>AI Suggest';
            }
        };
        
        textarea.parentNode.appendChild(aiButton);
    }
}

/**
 * Add sentiment analysis to analytics page
 */
function addSentimentAnalysis() {
    const sentimentButton = document.createElement('button');
    sentimentButton.className = 'btn btn-sm btn-outline btn-info';
    sentimentButton.innerHTML = '<i class="fas fa-brain mr-1"></i>Analyze Sentiment';
    sentimentButton.onclick = async () => {
        const text = prompt('Enter text to analyze sentiment:');
        if (text) {
            try {
                sentimentButton.disabled = true;
                sentimentButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Analyzing...';
                
                const sentiment = await hfMCP.analyzeSentiment(text);
                showNotification(`Sentiment Analysis: ${JSON.stringify(sentiment)}`, 'info');
            } catch (error) {
                showNotification('Error analyzing sentiment: ' + error.message, 'error');
            } finally {
                sentimentButton.disabled = false;
                sentimentButton.innerHTML = '<i class="fas fa-brain mr-1"></i>Analyze Sentiment';
            }
        }
    };
    
    // Add to analytics page
    const analyticsHeader = document.querySelector('.analytics-header');
    if (analyticsHeader) {
        analyticsHeader.appendChild(sentimentButton);
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Use existing notification system or create a simple one
    if (window.showNotification) {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
} 