import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('name')
  .setDescription('description');

export async function execute(interaction: CommandInteraction) {
}