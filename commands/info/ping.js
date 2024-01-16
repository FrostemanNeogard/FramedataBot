const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  category: "info",
  permissions: [],
  devCommand: false,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
  run: async ({ client, msg, args }) => {
    // Reply with "Pong!"
    return msg.reply("Pong!");
  },
};
