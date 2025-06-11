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
    .setName('ticket-setup')
    .setDescription('Setup the ticket-system')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const createButton = new discord_js_1.ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('🎫 Create Ticket')
            .setStyle(discord_js_1.ButtonStyle.Success);
        const row = new discord_js_1.ActionRowBuilder().addComponents(createButton);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("🎫 Tickets")
            .setDescription("Do you need help? Or maybe want to be part of the team? No Problem! We got you! Just create a ticket using the button below!")
            .setFooter({
            "text": "Astral Bot - Tickets"
        });
        yield interaction.reply({
            embeds: [embed],
            components: [row]
        });
    });
}
