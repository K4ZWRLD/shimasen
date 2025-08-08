const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message to say')
                .setRequired(true)),
    
    async execute(interaction) {
        const message = interaction.options.getString('message');
        
        // Send the message
        await interaction.reply({
            content: message,
            ephemeral: false
        });
    },
};
