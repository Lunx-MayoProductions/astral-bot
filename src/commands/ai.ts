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



    interaction.reply(".....");

        const response = await openaimodel.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528-qwen3-8b:free', // Free/cheap model
      messages: [
        { role: "system", content: "You are a helpful Discord bot named Astral." },
        { role: "user", content: prompt as string }
      ]
    })


    interaction.followUp(response.choices[0].message.content as string);
    
    
}