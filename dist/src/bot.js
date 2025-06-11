"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("../config.json");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const discord_js_2 = require("discord.js");
require("./util/database");
const crypto_1 = require("crypto");
const commands = [];
const clientId = "1380846995975176293";
const guildId = "1354493915637612554";
const commandsPath = path_1.default.join(__dirname, 'commands');
const commandFiles = fs_1.default.readdirSync(commandsPath).filter((file) => (file.endsWith('.ts') && !file.endsWith('.d.ts')) || file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path_1.default.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
    else {
        console.warn(`[WARNING] Command at ${filePath} is missing "data" or "execute".`);
    }
}
const rest = new discord_js_1.REST().setToken(config_json_1.token);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = yield rest.put(discord_js_1.Routes.applicationGuildCommands(String(clientId), String(guildId)), { body: commands });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (error) {
        console.error(error);
    }
}))();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildModeration,
        discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
        discord_js_1.GatewayIntentBits.GuildIntegrations,
        discord_js_1.GatewayIntentBits.GuildWebhooks,
        discord_js_1.GatewayIntentBits.GuildInvites,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildPresences,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildMessageTyping,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.DirectMessageReactions,
        discord_js_1.GatewayIntentBits.DirectMessageTyping,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildScheduledEvents,
        discord_js_1.GatewayIntentBits.AutoModerationConfiguration,
        discord_js_1.GatewayIntentBits.AutoModerationExecution
    ]
});
//TICKETS
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (interaction.isButton()) {
        if (interaction.customId === 'create_ticket') {
            const existingChannel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find((ch) => ch.name === `ticket-${interaction.user.id}` &&
                ch.type === 0 // text channel
            );
            if (existingChannel) {
                return interaction.reply({
                    content: 'You already have a ticket open!',
                    ephemeral: true,
                });
            }
            const channel = yield ((_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.channels.create({
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
            }));
            const closeButton = new discord_js_2.ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('Close Ticket')
                .setStyle(discord_js_2.ButtonStyle.Danger);
            const row = new discord_js_2.ActionRowBuilder().addComponents(closeButton);
            yield (channel === null || channel === void 0 ? void 0 : channel.send({
                content: `Hello ${interaction.user}, a staff member will be with you shortly.`,
                components: [row],
            }));
            yield interaction.reply({
                content: `Your ticket has been created: ${channel}`,
                ephemeral: true,
            });
        }
        else if (interaction.customId === 'close_ticket') {
            yield interaction.reply({ content: 'Closing ticket...', ephemeral: true });
            yield ((_c = interaction.user.dmChannel) === null || _c === void 0 ? void 0 : _c.send({
                "content": "Your transcript is ready!"
            }));
            const channel = interaction.channel;
            if (!interaction.guild) {
                return;
            }
            const transcriptChannel = yield interaction.guild.channels.create({
                name: `${channel.name}-transcript-${(0, crypto_1.randomUUID)().slice(0, 4)}`,
                type: discord_js_1.ChannelType.GuildText,
                reason: "Transcript requested"
            });
            const messages = yield channel.messages.fetch({ limit: 100 });
            const sorted = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
            for (const msg of sorted.values()) {
                const content = `**${msg.author.tag}**: ${msg.content}`;
                yield transcriptChannel.send({ content });
            }
            yield ((_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.delete());
        }
    }
}));
client.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setStatus('idle');
    (_b = client.user) === null || _b === void 0 ? void 0 : _b.setPresence({
        'activities': [
            {
                'name': 'Made with Astral',
                'type': discord_js_1.ActivityType.Playing
            }
        ]
    });
    const app = yield ((_c = client.application) === null || _c === void 0 ? void 0 : _c.fetch());
    console.log(`Logged in as ${(_d = client.user) === null || _d === void 0 ? void 0 : _d.tag}`);
    console.log(`Client ID: ${app === null || app === void 0 ? void 0 : app.id}`);
}));
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const command = require(`./commands/${interaction.commandName}`);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        yield command.execute(interaction);
    }
    catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
            yield interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        else {
            yield interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}));
const badwordPatterns = config_json_1.badwords.map(word => new RegExp(`\\b${word}\\b`, 'i'));
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    for (let pattern of badwordPatterns) {
        if (pattern.test(message.cleanContent)) {
            try {
                yield message.delete();
            }
            catch (error) {
                console.error('Failed to delete message:', error);
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle("🚫 Forbidden Content Detected")
                .setDescription("Your message was removed because it contained forbidden content. Please follow the server rules. If you believe this was a mistake, contact a moderator.")
                .setColor("Red");
            try {
                yield message.author.send({ embeds: [embed] });
            }
            catch (error) {
                console.error('Failed to send DM to user:', error);
            }
            break;
        }
    }
}));
client.login(config_json_1.token);
