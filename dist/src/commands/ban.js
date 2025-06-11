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
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server.')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .addUserOption(option => option.setName('user')
    .setDescription('The user to ban')
    .setRequired(true));
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = interaction.options.getUser('user', true);
        if (!interaction.guild) {
            return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        }
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
        }
        try {
            yield member.ban({ reason: `Banned by ${interaction.user.tag}` });
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('🔨 Member Banned')
                .addFields({ name: 'User', value: `${user.tag} (${user.id})` })
                .setColor('Red')
                .setTimestamp();
            yield interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error(error);
            yield interaction.reply({ content: `Failed to ban ${user.tag}.`, ephemeral: true });
        }
    });
}
