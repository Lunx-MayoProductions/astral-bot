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
    .setName('clearchat')
    .setDescription('Clears the chat.')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageMessages);
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.isTextBased)) {
            yield interaction.reply("The Channel isn't a TextChannel!");
            return;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("Green")
            .setTitle("Clearing the Chat!")
            .setTimestamp()
            .setDescription("The Chat is going to be cleared. (As of discords API Limits this will take a while)");
        yield interaction.reply({
            embeds: [embed]
        });
        const channel = interaction.channel;
        const fetched = yield channel.messages.fetch({ limit: 100 });
        const messages14Days = fetched.filter(msg => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000);
        const messagesTooOld = fetched.filter(msg => !messages14Days.has(msg.id));
        yield channel.bulkDelete(messages14Days, true);
        for (const msg of messagesTooOld.values()) {
            try {
                yield msg.delete();
                yield new Promise(r => setTimeout(r, 1000));
            }
            catch (_b) { }
        }
    });
}
