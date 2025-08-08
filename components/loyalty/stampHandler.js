const { PermissionFlagsBits } = require('discord.js');

const BASE_IMAGE_URL = 'https://cdn.discordapp.com/attachments/1333193696920866866/1387485122714140843/Untitled67_20250625122953.png';
const STAMP_EMOJI = '🧸';
const EMPTY_EMOJI = '⬜';
const MAX_STAMPS = 10;

function generateStampVisual(count) {
  return STAMP_EMOJI.repeat(count) + EMPTY_EMOJI.repeat(MAX_STAMPS - count);
}

async function handleStamp(interaction, loyaltyData, saveLoyaltyData) {
  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: '❌ Only admins can use this command.',
      ephemeral: true
    });
  }

  const target = interaction.options.getUser('user');
  if (!loyaltyData[target.id]) loyaltyData[target.id] = { stamps: 0 };

  if (loyaltyData[target.id].stamps >= MAX_STAMPS) {
    return interaction.reply({
      content: '🟤 This user already has a full card. Ask them to redeem it first.',
      ephemeral: true
    });
  }

  loyaltyData[target.id].stamps++;
  saveLoyaltyData();

  const count = loyaltyData[target.id].stamps;
  const stampsText = generateStampVisual(count);

  await interaction.reply({
    content: `🧸 Added a stamp for ${target.username}! (${count}/${MAX_STAMPS})\n${stampsText}\n${BASE_IMAGE_URL}`,
    ephemeral: true
  });
}

module.exports = { handleStamp };
