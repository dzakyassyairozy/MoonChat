const { getAiConfig, isConfigured, askAI } = require('../lib/aiProvider');

/**
 * Jarvis Command - OpenAI Compatible API Integration
 * Usage: .jarvis <your question or message>
 *        Reply to a message/photo with .jarvis
 */

async function jarvisCommand(sock, chatId, message, text) {
    try {
        // Read configuration
        let config;
        try {
            config = getAiConfig();
        } catch (error) {
            await sock.sendMessage(chatId, {
                text: 'âŒ Error: Configuration file (jarvis.json) not found or invalid.\nPlease set up your API credentials.'
            }, { quoted: message });
            return;
        }

        // Check if API key is configured
        if (!isConfigured(config)) {
            await sock.sendMessage(chatId, {
                text: 'âŒ **Configuration Required**\n\nPlease set up your API credentials in `jarvis.json`:\n\n' +
                      '- Replace `"api_key"` with your real API key (from OpenRouter, Groq, etc.)\n' +
                      '- Replace `"api_url"` with your actual API endpoint URL\n\n' +
                      '*Example configuration for OpenRouter:*' +
                      '```json\n{\n  "api_key": "YOUR_API_KEY",\n  "api_url": "https://openrouter.ai/api/v1/chat/completions",\n  "model": "openai/gpt-4o-mini"\n}\n```\n\nSee JARVIS_SETUP_GUIDE.md for configuration instructions.'
            }, { quoted: message });
            return;
        }

        // Get the actual message text
        let userMessage = text.trim();
        
        // If no text provided, check if replying to a message
        if (!userMessage) {
            const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (quotedMessage) {
                // Extract text from quoted message
                userMessage = quotedMessage.conversation?.trim() || 
                             quotedMessage.extendedTextMessage?.text?.trim() ||
                             quotedMessage.imageMessage?.caption?.trim() ||
                             quotedMessage.videoMessage?.caption?.trim() || '';
                
                if (userMessage) {
                    userMessage += '\n\n[Replying to your previous message]';
                } else {
                    await sock.sendMessage(chatId, {
                        text: 'âš ï¸ Please provide a question or reply to a message.\n\nExample: .jarvis What is the capital of France?'
                    }, { quoted: message });
                    return;
                }
            } else {
                await sock.sendMessage(chatId, {
                    text: 'âš ï¸ Please provide a question or reply to a message.\n\nExample: .jarvis What is the capital of France?'
                }, { quoted: message });
                return;
            }
        }

        // Show typing indicator
        await sock.sendPresenceUpdate('composing', chatId);

        // Prepare the request for OpenAI compatible API
        const aiResponse = await askAI([
                {
                    role: "system",
                    content: `Kamu adalah Moon Chat, asisten AI serbaguna yang membantu pengguna menjawab pertanyaan, memahami topik, menulis, menerjemahkan, merangkum, dan menyelesaikan tugas. Jawab sesuai bahasa dan kebutuhan pengguna dengan jelas dan akurat. Jangan mengarang fakta; jika tidak yakin atau tidak memiliki akses ke informasi terbaru, jelaskan keterbatasanmu. Berikan hasil akhir yang berguna tanpa menampilkan penalaran internal.`
                },
                {
                    role: "user",
                    content: userMessage
                }
        ]);

        // Get the AI response and send directly (without extra formatting)
        await sock.sendMessage(chatId, {
            text: aiResponse
        }, { quoted: message });

    } catch (error) {
        console.error('Jarvis command error:', error);
        
        let errorMessage = 'âŒ Error processing your request:\n\n';
        
        if (error.response) {
            // Server returned error
            const statusCode = error.response.status;
            
            if (statusCode === 401 || statusCode === 403) {
                errorMessage += `âš ï¸ **Authentication Failed**\n`;
                errorMessage += `\nThe API rejected your credentials.\n`;
                errorMessage += `\nPlease check your \`jarvis.json\` file:\n`;
                errorMessage += `- Ensure \`api_key\` is correctly set\n`;
                errorMessage += `- Verify you're using the right API endpoint`;
            } else if (statusCode === 500) {
                errorMessage += `ðŸ”§ **Server Error**\n`;
                errorMessage += `\nAPI server responded with status 500.\n`;
                errorMessage += `\nPossible causes:\n`;
                errorMessage += `- Invalid API endpoint URL\n`;
                errorMessage += `- Malformed request data\n`;
                errorMessage += `- API service temporarily unavailable\n`;
                
                // Check if it's a JSON parsing error from response
                try {
                    const responseData = error.response.data;
                    if (typeof responseData === 'string' && 
                        (responseData.includes('<html') || responseData.includes('<!DOCTYPE'))) {
                        errorMessage += `\nâš ï¸ Note: Received HTML instead of JSON response.\n`;
                        errorMessage += `This usually means the API URL is incorrect or not pointing to an OpenAI-compatible endpoint.`;
                    }
                } catch (e) {
                    // ignore
                }
            } else if (statusCode === 429) {
                errorMessage += `ðŸ“Š **Rate Limited**\n`;
                errorMessage += `\nToo many requests. Please wait before trying again.`;
            } else {
                errorMessage += `Status: ${statusCode}\n`;
                try {
                    if (error.response.data && typeof error.response.data === 'object') {
                        errorMessage += `\nDetails: ${JSON.stringify(error.response.data, null, 2)}`;
                    } else {
                        errorMessage += `\nResponse: ${error.response.data}`;
                    }
                } catch (e) {
                    errorMessage += `\nUnable to parse error response`;
                }
            }
        } else if (error.request) {
            errorMessage += `ðŸŒ **No Response**\n`;
            errorMessage += `\nCould not reach the API server.\n`;
            errorMessage += `\nCheck:\n`;
            errorMessage += `- Your internet connection\n`;
            errorMessage += `- API server is online\n`;
            errorMessage += `- Firewall/VPN settings`;
        } else if (error.code === 'ECONNREFUSED') {
            errorMessage += `ðŸ”Œ **Connection Refused**\n`;
            errorMessage += `\nThe API server refused the connection.\n`;
            errorMessage += `\nVerify that:\n`;
            errorMessage += `- The API_URL in \`jarvis.json\` is correct\n`;
            errorMessage += `- The port number (if specified) is correct\n`;
        } else {
            errorMessage += error.message || 'Unknown error occurred';
        }

        await sock.sendMessage(chatId, {
            text: errorMessage,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'Moon Chat MD',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    }
}

module.exports = jarvisCommand;
