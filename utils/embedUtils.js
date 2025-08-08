const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const EMBEDS_PATH = path.resolve(__dirname, '../data/embeds.json');

// 📥 Load saved embeds from JSON file
function loadEmbeds() {
  if (!fs.existsSync(EMBEDS_PATH)) return {};
  return JSON.parse(fs.readFileSync(EMBEDS_PATH, 'utf8'));
}

// 💾 Save embeds to file
function saveEmbeds(embeds) {
  fs.writeFileSync(EMBEDS_PATH, JSON.stringify(embeds, null, 2));
}

// 🎨 Construct preview embed
function buildPreviewEmbed(data) {
  const embed = new EmbedBuilder()
    .setColor(data.color || '#fcdc79')
    .setTitle(data.title || '')
    .setDescription(data.description || '');

  if (data.footer?.text) embed.setFooter({ text: data.footer.text, iconURL: data.footer.icon || undefined });
  if (data.footer?.timestamp) embed.setTimestamp();
  if (data.author?.name) embed.setAuthor({ name: data.author.name, iconURL: data.author.icon || undefined });
  if (data.image) embed.setImage(data.image);
  if (data.thumbnail) embed.setThumbnail(data.thumbnail);

  return embed;
}

// 🛠️ Generate embed editing buttons
function getEditButtons(embedName) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`edit_${embedName}_title`)
      .setLabel('Title')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`edit_${embedName}_description`)
      .setLabel('Description')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`edit_${embedName}_color`)
      .setLabel('Color')
      .setStyle(ButtonStyle.Secondary)
  );
}

module.exports = {
  loadEmbeds,
  saveEmbeds,
  buildPreviewEmbed,
  getEditButtons
};
