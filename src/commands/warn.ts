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
  .setName('warn')
  .setDescription('Warn a member')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption(option =>
    option.setName("user").setDescription("The User to warn").setRequired(true)
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

  if (existing.length > 0) {
    await db
      .update(warns)
      .set({ warns: existing[0].warns + 1 })
      .where(eq(warns.userid, parseInt(user.id)));
  } else {
    await db.insert(warns).values({
      userid: parseInt(user.id),
      warns: 1
    });
  }

  const embed = new EmbedBuilder()
    .setTitle("📗 Warned Successfully!")
    .setDescription(`${user.tag} now has ${existing.length > 0 ? existing[0].warns + 1 : 1} warning(s).`)
    .setColor("Green");

  await interaction.reply({
    embeds: [embed],
    ephemeral: true
  });
}
