const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { buildPreviewEmbed, getEditButtons, loadEmbeds, saveEmbeds } = require('../utils/embedUtils');

module.exports = {
  data: [
    new SlashCommandBuilder()
      .setName('embed_create')
      .setDescription('Create a new editable embed')
      .addStringOption(opt =>
        opt.setName('name').setDescription('Name of the embed').setRequired(true)),

    new SlashCommandBuilder()
      .setName('embed_list')
      .setDescription('List all saved embeds'),

    new SlashCommandBuilder()
      .setName('embed_delete')
      .setDescription('Delete a saved embed')
      .addStringOption(opt =>
        opt.setName('name').setDescription('Name of the embed').setRequired(true)),

    new SlashCommandBuilder()
      .setName('embed_send')
      .setDescription('Send a saved embed to this channel')
      .addStringOption(opt =>
        opt.setName('name').setDescription('Name of the embed').setRequired(true))
  ],

  async execute(interaction) {
    const cmd = interaction.commandName;
    const name = interaction.options.getString('name');
    const embeds = loadEmbeds();

    if (cmd === 'embed_create') {
      if (!name) return interaction.reply({ content: '❌ Name required.', ephemeral: true });
      if (embeds[name]) return interaction.reply({ content: '❌ Already exists.', ephemeral: true });

      embeds[name] = {
        title: '',
        description: '',
        color: '#fcdc79',
        footer: { text: '', icon: '', timestamp: false },
        author: { name: '', icon: '' },
        image: '',
        thumbnail: ''
      };

      saveEmbeds(embeds);

      await interaction.channel.send({
        content: `Embed **${name}** created!`,
        embeds: [buildPreviewEmbed(embeds[name])],
        components: [getEditButtons(name)]
      });

      await interaction.reply({ content: '✅ Sent.', ephemeral: true });

    } else if (cmd === 'embed_list') {
      const list = Object.keys(embeds).map(n => `• \`${n}\``).join('\n') || 'No embeds saved.';
      await interaction.reply({ content: `📦 **Embeds:**\n${list}`, ephemeral: true });

    } else if (cmd === 'embed_delete') {
      if (!embeds[name]) return interaction.reply({ content: '❌ Not found.', ephemeral: true });
      delete embeds[name];
      saveEmbeds(embeds);
      await interaction.reply({ content: `🗑️ Deleted **${name}**.`, ephemeral: true });

    } else if (cmd === 'embed_send') {
      if (!embeds[name]) return interaction.reply({ content: '❌ Not found.', ephemeral: true });
      await interaction.channel.send({
        embeds: [buildPreviewEmbed(embeds[name])]
      });
      await interaction.reply({ content: '✅ Sent.', ephemeral: true });
    }
  }
};
