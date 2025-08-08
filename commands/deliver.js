const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { sendDelivery } = require('../utils/deliveryUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deliver')
    .setDescription('Send a customer a warm DM message with a button and item links')
    .addUserOption(opt =>
      opt.setName('customer')
        .setDescription('The user to send the DM to')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('item_type')
        .setDescription('Intro item description')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('item_name')
        .setDescription('First item name')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('link_1')
        .setDescription('First item link')
        .setRequired(true))
    
        .addStringOption(opt =>
          opt.setName('nickname')
            .setDescription('Name or nickname to include')
    .setRequired(false))
    .addStringOption(opt =>
      opt.setName('item_2')
        .setDescription('Second item name')
        .setRequired(false))
    .addStringOption(opt =>
      opt.setName('link_2')
        .setDescription('Second item link')
        .setRequired(false))
    .addStringOption(opt =>
      opt.setName('item_3')
        .setDescription('Third item name')
        .setRequired(false))
    .addStringOption(opt =>
      opt.setName('link_3')
        .setDescription('Third item link')
        .setRequired(false)),

  async execute(interaction) {
    try {
      await sendDelivery(interaction);
    } catch (error) {
      console.error('Delivery command failed:', error);

      const errorMessage = { 
        content: '❌ Something went wrong while sending the delivery message.', 
        flags: MessageFlags.Ephemeral 
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  },
};