const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
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
        )
    ),

  async execute(interaction) {
    const state = interaction.options.getString('state');

    // Your stylized message with injected state
    const message = `
    _ _　　ᕱ⑅ᕱ　<:aabow:1317258669968330823>　(✿ᵔ⌑ᵔ)　ৎ
     _ _　✸ .     　⁺     ❀     .     　⁺  ✸      .
     _ _　　▩　<a:verbiscuit:1387280573038465044> 　𖧷　꙳　<@&1307222083570372639>  
     _ _　、˚　 <:curv:1403269808799223891>  ♡　⟰　shima's __is  ${state}__
     _ _　　▩　<a:1jitem8:1317136948657262615> 　𖧷　꙳　**check <#1391559320981864512> !**
     _ _　✸ .     　⁺     ❀     .     　⁺  ✸      .
    `;


    await interaction.reply({ content: message, ephemeral: false });
  }
};
