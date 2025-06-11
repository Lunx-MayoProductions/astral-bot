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
    .setName('commands')
    .setDescription('Sends a list of commands');
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Commands")
            .setDescription("In the following you will find a list of commands and their purposes!")
            .addFields({
            "name": "ban",
            "value": "Bans a user from the server."
        }, {
            "name": "kick",
            "value": "Kicks a user from the server."
        }, {
            "name": "clearchat",
            "value": "Clears the Chat!"
        }, {
            "name": "commands",
            "value": "Displays Commands"
        }, {
            "name": "help",
            "value": "Shows the purpose of the Bot!"
        }, {
            "name": "ping",
            "value": "Shows your ping to the bot."
        }, {
            "name": "ticket-setup",
            "value": "Sends a message 'bout tickets."
        });
        yield interaction.reply({
            embeds: [embed]
        });
    });
}
