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
const database_1 = require("../util/database");
const tables_1 = require("../util/tables");
const drizzle_orm_1 = require("drizzle-orm");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ModerateMembers)
    .addUserOption(option => option.setName("user").setDescription("The User to warn").setRequired(true));
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = interaction;
        const user = command.options.getUser('user', true);
        const db = yield (0, database_1.getDb)();
        const existing = yield db
            .select()
            .from(tables_1.warns)
            .where((0, drizzle_orm_1.eq)(tables_1.warns.userid, parseInt(user.id)))
            .limit(1);
        if (existing.length > 0) {
            yield db
                .update(tables_1.warns)
                .set({ warns: existing[0].warns + 1 })
                .where((0, drizzle_orm_1.eq)(tables_1.warns.userid, parseInt(user.id)));
        }
        else {
            yield db.insert(tables_1.warns).values({
                userid: parseInt(user.id),
                warns: 1
            });
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("📗 Warned Successfully!")
            .setDescription(`${user.tag} now has ${existing.length > 0 ? existing[0].warns + 1 : 1} warning(s).`)
            .setColor("Green");
        yield interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    });
}
