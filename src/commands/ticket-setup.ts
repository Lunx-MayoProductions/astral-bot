import {
  CommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ticket-setup')
  .setDescription('Setup the ticket-system')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: CommandInteraction) {

  const createButton = new ButtonBuilder()
    .setCustomId('create_ticket')
    .setLabel('🎫 Create Ticket')
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(createButton);

    const embed = new EmbedBuilder()
    .setTitle("🎫 Tickets")
    .setDescription("Do you need help? Or maybe want to be part of the team? No Problem! We got you! Just create a ticket using the button below!")
    .setFooter({
        "text":"Astral Bot - Tickets"
    });


  await interaction.reply({
    embeds: [embed],
    components: [row]
  });
}
