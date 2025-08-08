const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { loadOrders } = require('../utils/orderUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('orders')
    .setDescription('View a list of customer orders with optional filters')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Filter by customer')
        .setRequired(false))
    .addStringOption(opt =>
      opt.setName('item')
        .setDescription('Filter by item name')
        .setRequired(false))
    .addStringOption(opt =>
      opt.setName('status')
        .setDescription('Filter by order status')
        .setRequired(false))
    .addIntegerOption(opt =>
      opt.setName('page')
        .setDescription('Page number to display')
        .setRequired(false)),

  async execute(interaction) {
    const userFilter = interaction.options.getUser('user');
    const itemFilter = interaction.options.getString('item');
    const statusFilter = interaction.options.getString('status');
    let page = interaction.options.getInteger('page') || 1;

    const orders = loadOrders();
    let filtered = orders;

    if (userFilter) filtered = filtered.filter(o => o.user === userFilter.id);
    if (itemFilter) filtered = filtered.filter(o => o.item.toLowerCase().includes(itemFilter.toLowerCase()));
    if (statusFilter) filtered = filtered.filter(o => o.status.toLowerCase() === statusFilter.toLowerCase());

    const pageSize = 5;
    const totalPages = Math.ceil(filtered.length / pageSize);

    if (page > totalPages && totalPages !== 0) {
      return interaction.reply({
        content: `❌ Page out of range. There are only ${totalPages} pages.`,
        ephemeral: true
      });
    }

    const getPageContent = (currentPage) => {
      const slice = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      const lines = slice.map(o =>
        `• User: <@${o.user}>, Item: ${o.item}, Amount: ${o.amount}, Payment: ${o.mop}, Status: ${o.status}`
      );
      return {
        text: `📋 Orders page ${currentPage}/${totalPages || 1}:\n${lines.join('\n') || 'No orders found.'}`,
        buttons: new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('prev_orders')
            .setLabel('⬅ Previous')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentPage <= 1),
          new ButtonBuilder()
            .setCustomId('next_orders')
            .setLabel('Next ➡')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentPage >= totalPages)
        )
      };
    };

    const { text, buttons } = getPageContent(page);

    const reply = await interaction.reply({
      content: text,
      components: [buttons],
      ephemeral: true
    });

    const collector = reply.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: 'This isn’t your session.', ephemeral: true });
      }

      page = i.customId === 'prev_orders' ? page - 1 : page + 1;
      const { text: newText, buttons: newButtons } = getPageContent(page);

      await i.update({
        content: newText,
        components: [newButtons]
      });
    });
  }
};
