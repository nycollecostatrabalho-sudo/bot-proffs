const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let quantidadeProffs = 10;
const canalPermitido = '1482160162679554101';

client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return;

    const canalAtual = message.channel.id;
    const canalPai = message.channel.parentId;

    if (canalAtual !== canalPermitido && canalPai !== canalPermitido) {
      return;
    }

    if (message.content.startsWith('!proofs')) {
      const args = message.content.trim().split(/\s+/);
      const numero = parseInt(args[1], 10);

      if (Number.isNaN(numero) || numero <= 0) {
        return message.reply('❌ Use assim: !proofs 20');
      }

      quantidadeProffs = numero;

      try {
        await message.delete();
      } catch (err) {
        console.log('Não consegui apagar a mensagem do comando.');
      }

      const resposta = await message.channel.send(`✅ Agora está em ${quantidadeProffs} proofs`);

      setTimeout(() => {
        resposta.delete().catch((err) => {
          console.error('❌ Erro ao apagar a resposta do bot:', err);
        });
      }, 3000);

      return;
    }

    const imagens = message.attachments.filter(att => {
      return (
        att.contentType?.startsWith('image/') ||
        /\.(png|jpe?g|gif|webp)$/i.test(att.name || '')
      );
    });

    if (imagens.size === 0) return;

    const texto = `
# <:w_boxx:1482571087874228395> PROOF #${quantidadeProffs} <a:white_mydarling1:1483742901719531570> ʾ  ֶָ֪  ۫

**Obrigada pela preferência** <a:b_0001ss_exclamation:1482571094862073960> <a:pink_heart4:1482613228164087848>  
**-# Eternal Store**
`;

    await message.channel.send({
      content: texto,
      files: imagens.map(img => img.url)
    });

    try {
      await message.delete();
      console.log('✅ Mensagem com imagens apagada');
    } catch (err) {
      console.error('❌ Erro ao apagar a mensagem com imagens:', err);
    }
  } catch (error) {
    console.error('Erro ao processar mensagem:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);