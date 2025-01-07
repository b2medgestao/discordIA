const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

require('dotenv').config();

// ==== CONFIGURAÇÕES ====
// Substitua pelo token do seu Bot
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; 

// Substitua pela URL do seu Webhook Node no n8n
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL; 

// ==== CRIA E CONFIGURA O CLIENT ====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // Outros intents se precisar
  ],
});

// ==== EVENTO: BOT ONLINE ====
client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

// ==== EVENTO: NOVA MENSAGEM ====
client.on('messageCreate', async (message) => {
  // Evita que o bot envie mensagem dele mesmo
  if (message.author.bot) return;

  // Conteúdo da mensagem que será enviado ao n8n
  const payload = {
    author: message.author.username,
    authorId: message.author.id,
    channelId: message.channel.id,
    content: message.content,
    // Outros dados que você queira incluir
  };

  try {
    // Faz POST para o Webhook Node do n8n
    await axios.post(N8N_WEBHOOK_URL, payload);
    console.log('Mensagem enviada ao n8n:', payload);
  } catch (error) {
    console.error('Erro ao enviar mensagem ao n8n:', error);
  }
});

// ==== LOGIN NO DISCORD ====
client.login(DISCORD_BOT_TOKEN)
  .catch((err) => console.error('Erro ao logar no Discord:', err));
