const { SlashCommandBuilder } = require('discord.js');

// Store active alerts - in production, consider using a database
const activeAlerts = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('alert')
        .setDescription('Alert a user and set a 1-hour timer to check for channel activity')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to alert')
                .setRequired(true)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const channelId = interaction.channel.id;
        const alerterId = interaction.user.id;

        // Send the initial alert message
        await interaction.reply({
            content: `# hello! are you still there? ⠀⠀ ◌⠀ ⠀${targetUser}! this is an activity alert! \n⠀⠀<:curv:1403269808799223891> ⠀ please respond or we'll close the ticket \n-# we do this to avoid having unused tickets cluttering the shop ^^`,
            ephemeral: false
        });

        // Clear any existing timer for this channel
        if (activeAlerts.has(channelId)) {
            clearTimeout(activeAlerts.get(channelId).timer);
        }

        // Get the current message count to track activity
        const initialMessageCount = interaction.channel.messages.cache.size;

        // Set up 1-hour timer
        const timer = setTimeout(async () => {
            try {
                // Fetch recent messages to check for activity
                const messages = await interaction.channel.messages.fetch({ limit: 50 });
                const recentMessages = messages.filter(msg => 
                    msg.createdTimestamp > Date.now() - 3600000 && // Within last hour
                    !msg.author.bot // Ignore bot messages
                );

                // If no activity detected, ping the original command user
                if (recentMessages.size === 0) {
                    await interaction.channel.send({
                        content: `⏰ <@${alerterId}>, no activity detected in this channel for the past hour after your alert.`
                    });
                }

                // Clean up the stored alert
                activeAlerts.delete(channelId);
            } catch (error) {
                console.error('Error in alert timer:', error);
                activeAlerts.delete(channelId);
            }
        }, 3600000); // 1 hour in milliseconds

        // Store the alert info
        activeAlerts.set(channelId, {
            timer: timer,
            alerterId: alerterId,
            startTime: Date.now()
        });
    },
};
