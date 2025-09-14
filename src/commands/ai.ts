import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction
} from 'discord.js';

import { OpenAI } from 'openai';
import { openai } from '../../config.json';

export const data = new SlashCommandBuilder()
  .setName('ai')
  .setDescription('Sends an ai responsse per dm, the response is based on the prompt you provide.')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('The prompt to send to the AI')
        .setRequired(true));
export async function execute(interaction: CommandInteraction) {
      const openaimodel = new OpenAI({
        apiKey: openai,
     baseURL: 'https://openrouter.ai/api/v1'
    });

    const prompt = (interaction as ChatInputCommandInteraction).options.getString('prompt');

        const embed = new EmbedBuilder()
      .setTitle('Processing')
      .addFields({ name: 'Prompt', value: prompt as string })
      .setColor('Green')
      .setTimestamp();



    interaction.reply({embeds: [embed]});

        const response = await openaimodel.chat.completions.create({
      model: 'gpt-5', // Free/cheap model
      messages: [
        { role: "system", content: "You are a helpful Discord bot" },
        { role: "user", content: prompt as string }
      ]
    })


    interaction.followUp(response.choices[0].message.content as string);
    
    
}