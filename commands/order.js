const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ORDER_CHANNEL_ID = process.env.ORDER_CHANNEL_ID;
const { loadOrders, saveOrders } = require('../utils/orderUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('order')
    .setDescription('Log a new customer order')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Customer placing the order')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('item')
        .setDescription('Item being ordered')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('mop')
        .setDescription('Method of payment (e.g. Paypal, Nitro)')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('amount')
        .setDescription('Quantity ordered')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser('user');
    const item = interaction.options.getString('item');
    const mop = interaction.options.getString('mop');
    const amount = interaction.options.getString('amount');

    const orderText = `_ _\n_ _　　　♡ 　 ${user}'s order 　  .ᐟ\n　　_       _⠀⠀ ࣪⠀　${amount}x ${item}\n　　_    _ ⠀⠀ ࣪⠀　paid w: ${mop}\n　　_       _⠀⠀ ࣪⠀　status: pending\n-# 　　　　➶ ⠀⠀　₊ ⠀　 ੭`;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('status_paid').setLabel('paid').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('status_processing').setLabel('processing').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('status_done').setLabel('done').setStyle(ButtonStyle.Secondary)
    );

    await interaction.editReply({ content: orderText, components: [row] });

    const channel = await interaction.guild.channels.fetch(ORDER_CHANNEL_ID).catch(() => null);
    if (!channel?.isTextBased()) {
      return interaction.editReply({ content: '❌ Orders channel not found.' });
    }

    const msg = await channel.send({ content: orderText, components: [row] });

    let orders = loadOrders();
    if (!Array.isArray(orders)) orders = [];

    orders.push({
      user: user.id,
      item,
      amount,
      mop,
      status: 'pending',
      timestamp: Date.now(),
      messageId: msg.id,
      channelId: channel.id
    });

    saveOrders(orders);

    await interaction.editReply({ content: '✅ Order submitted!' });
  },
};
