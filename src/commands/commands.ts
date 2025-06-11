import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js';


export const data = new SlashCommandBuilder()
  .setName('commands')
  .setDescription('Sends a list of commands');

export async function execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
    .setTitle("Commands")
    .setDescription("In the following you will find a list of commands and their purposes!")
    .addFields(
        {
        "name":"ban",
        "value":"Bans a user from the server."
        },
                {
        "name":"kick",
        "value":"Kicks a user from the server."
        },
                {
        "name":"clearchat",
        "value":"Clears the Chat!"
        },
                {
        "name":"commands",
        "value":"Displays Commands"
        },
                {
        "name":"help",
        "value":"Shows the purpose of the Bot!"
        },
                {
        "name":"ping",
        "value":"Shows your ping to the bot."
        },
                {
        "name":"ticket-setup",
        "value":"Sends a message 'bout tickets."
        }
    );

    await interaction.reply({
        embeds: [embed]
    });
    
}