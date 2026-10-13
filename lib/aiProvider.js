const fs = require('fs');
const path = require('path');
const axios = require('axios');

function getAiConfig() {
    let fileConfig = {};
    try {
        fileConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../jarvis.json'), 'utf8'));
    } catch (error) {
        if (error.code !== 'ENOENT') console.error('Invalid jarvis.json:', error.message);
    }
    return {
        ...fileConfig,
        api_key: process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY || fileConfig.api_key,
        api_url: process.env.AI_API_URL || fileConfig.api_url || 'https://openrouter.ai/api/v1/chat/completions',
        model: process.env.AI_MODEL || fileConfig.model || 'openai/gpt-4o-mini'
    };
}

function isConfigured(config) {
    return Boolean(config?.api_key && !/your_|placeholder|^\s*$/.test(config.api_key) &&
        config.api_url && !/your-/.test(config.api_url));
}

async function askAI(messages, overrides = {}) {
    const config = getAiConfig();
    if (!isConfigured(config)) {
        const error = new Error('NO_CONFIG');
        error.code = 'NO_CONFIG';
        throw error;
    }
    const response = await axios.post(config.api_url, {
        model: overrides.model || config.model,
        messages,
        max_tokens: Number(config.max_tokens) || 2048,
        temperature: Number.isFinite(Number(config.temperature)) ? Number(config.temperature) : 0.7,
        stream: false
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.api_key}`,
            'HTTP-Referer': 'https://github.com/Hamzah82/MoonChat',
            'X-Title': 'Moon Chat MD'
        },
        timeout: 60000
    });
    const content = response.data?.choices?.[0]?.message?.content;
    if (typeof content === 'string' && content.trim()) return content.trim();
    if (Array.isArray(content)) {
        const text = content.map(part => part?.text || '').filter(Boolean).join('\n').trim();
        if (text) return text;
    }
    throw new Error('AI provider returned an empty response');
}

module.exports = { getAiConfig, isConfigured, askAI };
