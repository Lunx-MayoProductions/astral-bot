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
    .setName('help')
    .setDescription('Answers 4 W Questions! (Who, Why, What)');
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({
            "name": "Lunx"
        })
            .setTitle("Some Info!")
            .setDescription("The Astral Bot is a small project started by the developer Lunx. It started because of the lack of projects, no really! Lunx did not have enough work! Firstly this bot was known as: 'Potato' or 'PotatoBot' but that sounded bad and was an akward name. Also was the early bot coded in python. The current bot is coded in typescript. What can this bot do? IDK, find out ig!")
            .setColor("Fuchsia")
            .setFooter({
            "text": "Astral Bot - La Vida Es Un Carussel!"
        });
        yield interaction.reply({
            embeds: [embed]
        });
    });
}
