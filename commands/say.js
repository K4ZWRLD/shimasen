const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message to say')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Type of message')
                .setRequired(false)
                .addChoices(
                    { name: 'Spacer', value: 'spacer' },
                    { name: 'Normal', value: 'normal' }
                )),
    
    async execute(interaction) {
        const message = interaction.options.getString('message');
        const type = interaction.options.getString('type') || 'normal';
        
        let finalMessage = message;
        
        // If type is spacer, use the predefined spacer
        if (type === 'spacer') {
            finalMessage = "⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀\n⠀";
        }
        
        // Check if message is too long (Discord limit is 2000 characters)
        if (finalMessage.length > 2000) {
            return await interaction.reply({
                content: `❌ Message is too long! Discord has a 2000 character limit. Your message is ${finalMessage.length} characters.`,
                ephemeral: true
            });
        }
        
        try {
            // Reply to the interaction first (ephemeral so only the command user sees it)
            await interaction.reply({
                content: '✅ Message sent!',
                ephemeral: true
            });
            
            // Send the actual message separately to the channel
            await interaction.channel.send(finalMessage);
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // If we already replied, use followUp
            if (interaction.replied) {
                await interaction.followUp({
                    content: '❌ Failed to send the message. It might be too long or contain invalid content.',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '❌ Failed to send the message. It might be too long or contain invalid content.',
                    ephemeral: true
                });
            }
        }
    },
};
