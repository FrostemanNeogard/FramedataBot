const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "fd",
  category: "tekken",
  permissions: [],
  devCommand: false,
  data: new SlashCommandBuilder()
    .setName("fd")
    .setDescription("(OBSOLETE) Responds with information about new commands."),
  async execute(interaction) {
    await interaction.reply(
      `This command has been rendered obsolete. Please use the new "fd7" or "fd8" commands for Tekken 7 and Tekken 8 respectively.`
    );
    return;
  },
  run: async ({ client, msg, args }) => {
    await msg.reply(
      `This command has been rendered obsolete. Please use the new "fd7" or "fd8" commands for Tekken 7 and Tekken 8 respectively.`
    );
    return;
  },
};
