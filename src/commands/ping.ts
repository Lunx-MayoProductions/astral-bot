import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with Pong!');

export async function execute(interaction: CommandInteraction) {
  const sent = await interaction.reply({ content: 'Pinging…'});

  const roundTrip = sent.createdTimestamp - interaction.createdTimestamp;
  const apiPing = Math.round(interaction.client.ws.ping);

  const embed = new EmbedBuilder()
    .setTitle('🏓 Pong!')
    .addFields(
      { name: 'Round-trip', value: `${roundTrip}ms`, inline: true },
      { name: 'API Latency', value: `${apiPing}ms`, inline: true },
    )
    .setColor('Green');
  await interaction.editReply({ content: null, embeds: [embed] });
}