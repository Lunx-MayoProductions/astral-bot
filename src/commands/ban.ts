import {
  CommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  GuildMember,
  User,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a user from the server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to ban')
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const user: User = (interaction as import('discord.js').ChatInputCommandInteraction).options.getUser('user', true);

  if (!interaction.guild) {
    return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  }

  const member = interaction.guild.members.cache.get(user.id);

  if (!member) {
    return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
  }

  try {
    await member.ban({ reason: `Banned by ${interaction.user.tag}` });

    const embed = new EmbedBuilder()
      .setTitle('🔨 Member Banned')
      .addFields({ name: 'User', value: `${user.tag} (${user.id})` })
      .setColor('Red')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: `Failed to ban ${user.tag}.`, ephemeral: true });
  }
}
