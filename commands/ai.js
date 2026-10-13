const { getAiConfig, isConfigured, askAI } = require('../lib/aiProvider');

/**
 * AI Command - Menggunakan OpenRouter API untuk .gpt dan .gemini
 * Baca konfigurasi dari jarvis.json (satu source of truth)
 */

async function aiCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        
        if (!text) {
            return await sock.sendMessage(chatId, { 
                text: "Gunakan .gpt atau .gemini diikuti pertanyaanmu\n\nContoh:\n.gpt apa itu AI?\n.gemini jelaskan fisika kuantum"
            }, { quoted: message });
        }

        const parts = text.split(' ');
        const command = parts[0].toLowerCase();
        const query = parts.slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, { 
                text: "Masukkan pertanyaan setelah perintah.\n\nContoh:\n.gpt apa itu AI?"
            }, { quoted: message });
        }

        // Show processing reaction
        await sock.sendMessage(chatId, {
            react: { text: '🧠', key: message.key }
        });

        // Tentukan model berdasarkan command
        // Both aliases use the configured provider/model. Hard-coded models
        // made one of the aliases fail for most OpenAI-compatible endpoints.
        const config = getAiConfig();
        const model = command === '.gemini' ? config.models?.gemini : config.models?.gpt;

        try {
            if (!isConfigured(config)) throw Object.assign(new Error('NO_CONFIG'), { code: 'NO_CONFIG' });
            const answer = await askAI([
                { role: 'system', content: 'Kamu adalah asisten AI serbaguna. Jawab pertanyaan dan permintaan dengan akurat, jelas, dan sesuai bahasa pengguna. Berikan konteks yang cukup; jika informasi tidak pasti atau tidak tersedia, katakan dengan jujur dan jangan mengarang.' },
                { role: 'user', content: query }
            ], { model });
            
            if (answer) {
                await sock.sendMessage(chatId, { text: answer }, { quoted: message });
            } else {
                throw new Error('Kosong');
            }
        } catch (err) {
            if (err.message === 'NO_CONFIG') {
                await sock.sendMessage(chatId, {
                    text: '❌ **API Key belum diatur**\n\n' +
                          'Edit file `jarvis.json` dan isi `api_key` dengan key dari OpenRouter:\n' +
                          '1. Daftar di https://openrouter.ai/keys\n' +
                          '2. Copy API key-nya\n' +
                          '3. Paste ke `jarvis.json`\n\n' +
                          'Atau gunakan `.jarvis` command dengan konfigurasi yang sama.'
                }, { quoted: message });
            } else {
                console.error('AI Command API Error:', err.message);
                await sock.sendMessage(chatId, {
                    text: '❌ Gagal mendapatkan jawaban. Coba lagi nanti.\n\n' +
                          'Tips: Pastikan file `jarvis.json` berisi API key yang valid dari OpenRouter.'
                }, { quoted: message });
            }
        }
    } catch (error) {
        console.error('AI Command Error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Terjadi error. Coba lagi ya.'
        }, { quoted: message });
    }
}

module.exports = aiCommand;
