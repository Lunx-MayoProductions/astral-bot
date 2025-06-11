import { Client, GatewayIntentBits, REST, Routes, RESTPostAPIApplicationCommandsJSONBody, TextChannel, ChannelType, EmbedBuilder, ActivityType } from 'discord.js';
import { token, badwords, openai } from '../config.json';
import fs from 'fs';
import path from 'path';
import {
  CommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Channel,
} from 'discord.js';





import OpenAI, { OpenAIError } from 'openai';

import app from './backend/server';

import "./util/database";
import { randomUUID } from 'crypto';
import { apiUrl } from './backend/server';

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

const clientId = "1380846995975176293";
const guildId = "1354493915637612554";





const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) =>
  (file.endsWith('.ts') && !file.endsWith('.d.ts')) || file.endsWith('.js')
);




for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[WARNING] Command at ${filePath} is missing "data" or "execute".`);
  }
}








const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(String(clientId), String(guildId)),
      { body: commands },
    );

    console.log(`Successfully reloaded ${(data as any[]).length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();





const client = new Client({
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution
  ]
});


//TICKETS
client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'create_ticket') {
      const existingChannel = interaction.guild?.channels.cache.find(
        (ch) =>
          ch.name === `ticket-${interaction.user.id}` &&
          ch.type === 0 // text channel
      );

      if (existingChannel) {
        return interaction.reply({
          content: 'You already have a ticket open!',
          ephemeral: true,
        });
      }
      const channel = await interaction.guild?.channels.create({
        name: `ticket-${interaction.user.id}`,
        type: 0, // GuildText
        topic: `Ticket for ${interaction.user.tag} (${interaction.user.id})`,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ['ViewChannel'],
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          },
          // Optionally add a support team role here:
          // {
          //   id: 'SUPPORT_ROLE_ID',
          //   allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          // },
        ],
      });
      const closeButton = new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton);

      await channel?.send({
        content: `Hello ${interaction.user}, a staff member will be with you shortly.`,
        components: [row],
      });

      await interaction.reply({
        content: `Your ticket has been created: ${channel}`,
        ephemeral: true,
      });
    } else if (interaction.customId === 'close_ticket') {
      await interaction.reply({ content: 'Closing ticket...', ephemeral: true });
      await interaction.user.dmChannel?.send({
        "content":"Your transcript is ready!"
      });

      const channel: TextChannel = interaction.channel as TextChannel;

      if (!interaction.guild) {
        return;
      }

    const transcriptChannel = await interaction.guild.channels.create({
      name: `${channel.name}-transcript-${randomUUID().slice(0, 4)}`,
      type: ChannelType.GuildText,
      reason: "Transcript requested",
      "permissionOverwrites": [
        {
          id: interaction.guild.roles.everyone,
          deny: ['ViewChannel'],
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
        },
        // Optionally add a support team role here:
        // {
        //   id: 'SUPPORT_ROLE_ID',
        //   allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
        // },
      ],
  });

  const messages = await (channel as TextChannel).messages.fetch({ limit: 100 });

  const sorted = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

  for (const msg of sorted.values()) {
    const content = `**${msg.author.tag}**: ${msg.content}`;
    await (transcriptChannel as TextChannel).send({ content });
  }

      await interaction.channel?.delete();
    }
  }
});



client.once('ready', async () => {
  client.user?.setStatus('idle')
  client.user?.setPresence({
    'activities':[
      {
        'name':'Made with Astral',
        'type':ActivityType.Playing
      }
    ]
  })
  const app = await client.application?.fetch();
  console.log(`Logged in as ${client.user?.tag}`);
  console.log(`Client ID: ${app?.id}`);
});

  const openaimodel = new OpenAI({
  apiKey: openai,
  baseURL: 'https://openrouter.ai/api/v1'
});


client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = require(`./commands/${interaction.commandName}`);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

const badwordPatterns = badwords.map(word => new RegExp(`\\b${word}\\b`, 'i'));

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const content = message.cleanContent;
  for (const pattern of badwordPatterns) {
    if (pattern.test(content)) {
      await message.author.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🚫 Bad Word Detected')
            .setDescription(`Your message in **${message.guild?.name}** contained a prohibited word and has been removed.`)
            .setFooter({ text: 'Please refrain from using such language.' })
        ]
      });
      await message.delete();
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.cleanContent.startsWith("!ai")) return;

  const finalmsg = message.cleanContent.replace("!ai", "").trim();
  if (!finalmsg) {
    return message.reply("❗ Please provide a prompt after `!ai`.");
  }

  try {
    await message.channel.sendTyping();

    const response = await openaimodel.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528-qwen3-8b:free', // Free/cheap model
      messages: [
        { role: "system", content: "You are a helpful Discord bot named Astral." },
        { role: "user", content: finalmsg }
      ]
    });

    const reply = response.choices[0].message.content;
    await message.reply(reply as string);

  } catch (error: any) {
    console.error("OpenAI error:", error);

    if (error.code === 'insufficient_quota') {
      await message.reply("⚠️ Astral has no power left (quota exceeded). Please try again later.");
    } else if (error.status === 429) {
      await message.reply("⏳ Astral is a bit overwhelmed (rate limit hit). Try again shortly.");
    } else {
      await message.reply("❌ An unexpected error occurred while contacting the AI.");
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.cleanContent.startsWith("!code")) return;

  const finalmsg = message.cleanContent.replace("!code", "").trim();
  if (!finalmsg) {
    return message.reply("❗ Please provide a prompt after `!code`.");
  }

  try {
    await message.reply("Generating.... This may take a while, please be patient.");
    await message.channel.sendTyping();

    const response = await openaimodel.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528-qwen3-8b:free', // Free/cheap model
      messages: [
        { role: "system", content: "Your Astral. A discord bot in the roll of an ai code assistant. You love helping people code effecient and productive code. Also if the user passes --no-comments in the prompt please put no comments in the code. No one needs to know your ai! your max outout is 2000 characters. You can ONLY use 2000 chracters." },
        { role: "user", content: finalmsg }
      ]
    });

    const reply = response.choices[0].message.content;
    await message.reply(reply as string);

  } catch (error: any) {
    console.error("OpenAI error:", error);

    if (error.code === 'insufficient_quota') {
      await message.reply("⚠️ Astral has no power left (quota exceeded). Please try again later.");
    } else if (error.status === 429) {
      await message.reply("⏳ Astral is a bit overwhelmed (rate limit hit). Try again shortly.");
    } else {
      await message.reply("❌ An unexpected error occurred while contacting the AI.");
    }
  }
});



/*client.on('guildMemberAdd', async (member) => {
  const user = member.id;
  const db = require('./util/database').getDb();
  const { verified } = require('./util/database').tables;
  const { eq, or } = require('drizzle-orm');

    const existing = await db
      .select()
          .from(verified)
          .where(
            eq(verified.userid, parseInt(user)),  
          )
          .limit(1);

  if (existing.length === 0) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Verification Required')
      .setDescription(`Welcome <@${user}>! Please verify using our api endpoint: [Verify Here](${apiUrl}/verify?user=${user})`)
      .setFooter({ text: 'Astral Verification' });

      member.send({
        embeds: [embed]})

        member.kick("User not verified")
        .then(() => console.log(`Kicked unverified user: ${user}`))
  }
});
*/



client.login(token);


const port = 6800;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`You can access the API at http://localhost:${port}/warn?user=<user_id>`);
    console.log(`You can ping the server at http://localhost:${port}/ping`);
});