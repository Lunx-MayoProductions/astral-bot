import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  User
} from 'discord.js';
import { getDb } from '../util/database';
import { warns } from '../util/tables';
import { eq } from 'drizzle-orm';

export const data = new SlashCommandBuilder()
  .setName('warns')
  .setDescription('See the warns of a member')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption(option =>
    option.setName("user").setDescription("The User").setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const command = interaction as import('discord.js').ChatInputCommandInteraction;
  const user: User = command.options.getUser('user', true);

  const db = await getDb();
  const existing = await db
    .select()
    .from(warns)
    .where(eq(warns.userid, Number(user.id)))
    .limit(1);

  const embed = new EmbedBuilder()
    .setTitle("📗 Warns!")
    .setDescription(`${user.tag} has ${existing.length > 0 ? existing[0].warns : 0} warning(s).`)
    .setColor("Green");

  await interaction.reply({
    embeds: [embed],
    ephemeral: true
  });
}
