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
    .setName('antiblock')
    .setDescription('Sends a message that contains a "badword" but does not get blocked.')
    .addStringOption((option) => option.setName("badword").setRequired(true).setDescription("The message containning the bad word you want to send!"));
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const badword = interaction.options.getString("badword", true);
        interaction.reply({
            "content": badword
        });
    });
}
