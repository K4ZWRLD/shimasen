const { EmbedBuilder } = require('discord.js');

const MAX_STAMPS = 10;

async function handleRedeem(interaction, loyaltyData, saveLoyaltyData) {
  const user = interaction.user;
  const card = loyaltyData[user.id] || { stamps: 0 };

  if (card.stamps < MAX_STAMPS) {
    return interaction.reply({
      content: `🧸 You need ${MAX_STAMPS} stamps to redeem. You have ${card.stamps}.`,
      ephemeral: true
    });
  }

  // Reset the user's card
  loyaltyData[user.id].stamps = 0;
  saveLoyaltyData();

  const embed = new EmbedBuilder()
    .setTitle('🎉 Loyalty Reward Redeemed!')
    .setDescription(`Thanks for your support, ${user.username}!\nYour card has been reset, and your reward is on its way.`)
    .setColor(0x57f287);

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { handleRedeem };
