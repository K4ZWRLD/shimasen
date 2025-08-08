const { EmbedBuilder } = require('discord.js');

const BASE_IMAGE_URL = 'https://cdn.discordapp.com/attachments/1333193696920866866/1387485122714140843/Untitled67_20250625122953.png';
const STAMP_EMOJI = '🧸';
const EMPTY_EMOJI = '⬜';
const MAX_STAMPS = 10;

function generateStampVisual(count) {
  return STAMP_EMOJI.repeat(count) + EMPTY_EMOJI.repeat(MAX_STAMPS - count);
}

async function handleCard(interaction, loyaltyData) {
  const target = interaction.options.getUser('user') || interaction.user;
  const cardData = loyaltyData[target.id] || { stamps: 0 };
  const count = cardData.stamps;

  const embed = new EmbedBuilder()
    .setTitle(`${target.username}'s Loyalty Card`)
    .setDescription(`**Stamps:** ${count}/${MAX_STAMPS}\n${generateStampVisual(count)}`)
    .setImage(BASE_IMAGE_URL)
    .setColor(0xfcdc79);

  await interaction.reply({
    embeds: [embed]
  });
}

module.exports = { handleCard };
