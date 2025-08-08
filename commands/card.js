const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('card')
    .setDescription("Show your or someone else's loyalty card")
    .addUserOption(option =>
      option.setName('user')
        .setDescription("User to show the loyalty card for")
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const loyaltyData = require('../data/loyalty.json'); // Adjust path if different
    const { handleCard } = require('../components/loyalty/cardHandler.js');

    await handleCard(interaction, loyaltyData);
  }
};
