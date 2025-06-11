import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  TextChannel
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('clearchat')
  .setDescription('Clears the chat.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

export async function execute(interaction: CommandInteraction) {
    if (!interaction.channel?.isTextBased){
        await interaction.reply("The Channel isn't a TextChannel!")
        return;
    }

    const embed = new EmbedBuilder()
    .setColor("Green")
    .setTitle("Clearing the Chat!")
    .setTimestamp()
    .setDescription("The Chat is going to be cleared. (As of discords API Limits this will take a while)");

    await interaction.reply({
        embeds: [embed]
    });

    const channel = interaction.channel as TextChannel;

    const fetched = await channel.messages.fetch({ limit: 100 });
    const messages14Days = fetched.filter(msg => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000);
    const messagesTooOld = fetched.filter(msg => !messages14Days.has(msg.id));

    await channel.bulkDelete(messages14Days, true);

    for (const msg of messagesTooOld.values()) {
        try {
            await msg.delete();
            await new Promise(r => setTimeout(r, 1000));
        } catch {}
    }
}