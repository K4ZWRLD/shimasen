// index.js
const { 
  Client, 
  GatewayIntentBits, 
  Collection,
  PermissionFlagsBits
} = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// Import ticket handler
const { handleTicketInteractions, initializeTicketCounter } = require('./utils/ticket.js');

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Load commands from ./commands folder
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
    console.log(`✅ Loaded command: ${command.data.name}`);
  } else {
    console.warn(`⚠️ Skipped loading ${file}: missing data or execute`);
  }
}

// Interaction handling
client.on('interactionCreate', async interaction => {
  try {
    // Slash commands
    if (interaction.isChatInputCommand()) {
      console.log(`\n=== INTERACTION DEBUG ===`);
      console.log(`Command: ${interaction.commandName}`);
      console.log(`User: ${interaction.user.tag}`);
      console.log('Raw options:', interaction.options.data);
      console.log('========================\n');

      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.log(`❌ Command ${interaction.commandName} not found`);
        return;
      }
      await command.execute(interaction);
      return; // Exit early for slash commands
    }

    // Button: Delivery reveal
    if (interaction.isButton() && interaction.customId.startsWith('reveal_items_')) {
      const { deliveryMap } = require('./utils/deliveryUtils.js');
      const interactionId = interaction.customId.replace('reveal_items_', '');
      const delivery = deliveryMap.get(interactionId);

      if (!delivery) {
        return interaction.reply({ content: '⚠️ Delivery data not found.', ephemeral: true });
      }

      const { item_name, link_1, item_2, link_2, item_3, link_3 } = delivery;
      let replyContent = `here are your items darling! !\n`;
      if (item_name && link_1) replyContent += `• [${item_name}](${link_1})\n`;
      if (item_2 && link_2) replyContent += `• [${item_2}](${link_2})\n`;
      if (item_3 && link_3) replyContent += `• [${item_3}](${link_3})\n`;

      await interaction.reply({ content: replyContent, ephemeral: true });
      return; // Exit early for delivery buttons
    }

    // Ticket interactions (buttons + modals)
    if (interaction.isButton() || interaction.isModalSubmit()) {
      // Debug log
      if (interaction.isButton()) {
        console.log(`🔍 Ticket Button: ${interaction.customId}`);
      }
      if (interaction.isModalSubmit()) {
        console.log(`🔍 Ticket Modal Submitted: ${interaction.customId}`);
      }
      await handleTicketInteractions(client, interaction);
      return;
    }
  } catch (error) {
    console.error(`❌ Error handling interaction:`, error);
    const errorMessage = {
      content: 'There was an error processing this interaction.',
      ephemeral: true,
    };
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    } catch (followUpError) {
      console.error('❌ Error sending error message:', followUpError);
    }
  }
});

// On ready, initialize ticket counters for all guilds
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`📊 Loaded ${client.commands.size} commands`);
  
  client.user.setPresence({
    activities: [{ name: 'boost shimas!', type: 0 }], // Type 0 = Playing
    status: 'dnd'
  });
  
  client.guilds.cache.forEach(guild => {
    initializeTicketCounter(guild);
  });
});

// Login (remove duplicate)
client.login(process.env.TOKEN);