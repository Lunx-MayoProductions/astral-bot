import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  ChatInputCommandInteraction
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('antiblock')
  .setDescription('Sends a message that contains a "badword" but does not get blocked.')
  .addStringOption((option) => option.setName("badword").setRequired(true).setDescription("The message containning the bad word you want to send!"));

export async function execute(interaction: CommandInteraction) {
    const badword: string = (interaction as ChatInputCommandInteraction).options.getString("badword", true);
    interaction.reply({
        "content": badword
    });
}
