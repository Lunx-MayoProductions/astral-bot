import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Answers 4 W Questions! (Who, Why, What)');

export async function execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
        .setAuthor({
            "name":"Lunx"
        })
        .setTitle("Some Info!")
        .setDescription(
            "The Astral Bot is a small project started by the developer Lunx. It started because of the lack of projects, no really! Lunx did not have enough work! Firstly this bot was known as: 'Potato' or 'PotatoBot' but that sounded bad and was an akward name. Also was the early bot coded in python. The current bot is coded in typescript. What can this bot do? IDK, find out ig!"
        )
        .setColor("Fuchsia")
        .setFooter({
            "text":"Astral Bot - La Vida Es Un Carussel!"
        });

    await interaction.reply({
        embeds: [embed]
    })
}