const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = './data/loyalty.json';
const { handleStamp } = require('../components/loyalty/stampHandler.js');

function loadLoyaltyData() {
  try {
    const data = fs.readFileSync(path, 'utf8');
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLoyaltyData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stamp')
    .setDescription('Add a stamp to a user’s loyalty card (Admin only)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to add a stamp to')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Only admins can use this command.'});
    }

    const loyaltyData = loadLoyaltyData();

    // Pass the save function to the handler so it can save updated data
    await handleStamp(interaction, loyaltyData, () => saveLoyaltyData(loyaltyData));
  }
};
