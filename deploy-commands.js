const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const commands = [
  // Embed commands
  new SlashCommandBuilder()
    .setName('embed_create')
    .setDescription('Create a new editable embed')
    .addStringOption(opt => opt.setName('name').setDescription('Name of the embed').setRequired(true)),

  new SlashCommandBuilder()
    .setName('embed_list')
    .setDescription('List all saved embeds'),

  new SlashCommandBuilder()
    .setName('embed_delete')
    .setDescription('Delete a saved embed')
    .addStringOption(opt => opt.setName('name').setDescription('Name of the embed').setRequired(true)),

  new SlashCommandBuilder()
    .setName('embed_send')
    .setDescription('Send a saved embed to this channel')
    .addStringOption(opt => opt.setName('name').setDescription('Name of the embed').setRequired(true)),

  // Order commands
  new SlashCommandBuilder()
    .setName('order')
    .setDescription('Submit a new order')
    .addUserOption(opt => opt.setName('user').setDescription('User who ordered').setRequired(true))
    .addStringOption(opt => opt.setName('item').setDescription('Item ordered').setRequired(true))
    .addStringOption(opt => opt.setName('mop').setDescription('Method of payment').setRequired(true))
    .addStringOption(opt => opt.setName('amount').setDescription('Amount ordered').setRequired(true)),

  new SlashCommandBuilder()
    .setName('orders')
    .setDescription('View or search order logs')
    .addUserOption(opt => opt.setName('user').setDescription('Filter by user'))
    .addStringOption(opt => opt.setName('item').setDescription('Filter by item'))
    .addStringOption(opt => opt.setName('status').setDescription('Filter by status (pending, paid, etc.)'))
    .addIntegerOption(opt => opt.setName('page').setDescription('Page number (for pagination)')),

  // Say command
  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something')
    .addStringOption(opt => opt.setName('message').setDescription('Message to say').setRequired(true))
    .addStringOption(opt =>
      opt.setName('type')
        .setDescription('Type of message')
        .setRequired(false)
        .addChoices(
          { name: 'Spacer', value: 'spacer' },
          { name: 'Normal', value: 'normal' }
        )),

  // Alert command
  new SlashCommandBuilder()
    .setName('alert')
    .setDescription('Alert a user and set a 1-hour timer to check for channel activity')
    .addUserOption(opt => opt.setName('user').setDescription('The user to alert').setRequired(true)),

  // Ticket command
  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Setup the ticket panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  // Loyalty card commands
  new SlashCommandBuilder()
    .setName('stamp')
    .setDescription('Manually add a stamp to a user\'s loyalty card')
    .addUserOption(opt => opt.setName('user').setDescription('User to stamp').setRequired(true)),

  new SlashCommandBuilder()
    .setName('card')
    .setDescription('Show your or another user\'s loyalty card')
    .addUserOption(opt => opt.setName('user').setDescription('User to view')),

  new SlashCommandBuilder()
    .setName('redeem')
    .setDescription('Redeem your loyalty card if full'),

  new SlashCommandBuilder()
  .setName('deliver')
  .setDescription('Send a custom item to a user with buttons')
  .addUserOption(opt =>
    opt.setName('customer')
      .setDescription('User to DM')
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
    opt.setName('quantity')
      .setDescription('Quantity')
      .setRequired(true))
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

  // 🛍️ Status command
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('Update the shop status')
    .addStringOption(opt =>
      opt.setName('state')
        .setDescription('Current status of the shop')
        .setRequired(true)
        .addChoices(
          { name: '🟢 Open', value: 'open' },
          { name: '🔴 Closed', value: 'closed' },
          { name: '🟡 Slow', value: 'slow' }
        ))
]
.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🚀 Deploying slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands deployed.');
  } catch (err) {
    console.error('❌ Error deploying commands:', err);
  }
})();