const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "help",
  category: "info",
  permissions: [],
  devCommand: false,
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get some help"),
  async execute(interaction) {
    const responseEmbed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("HELP")
      .setDescription(`List of all available commands:`)
      .setFields([
        {
          name: "/fd8",
          value: "Responds with frame data for the given attack. (Tekken 8)",
        },
        {
          name: "/fd7",
          value: "Responds with frame data for the given attack. (Tekken 7)",
        },
        {
          name: "/report",
          value: "Send feedback about this bot.",
        },
        {
          name: "/help",
          value: "Replies with information for all commands.",
        },
        {
          name: "/support",
          value: "View how to support the creator of this bot.",
        },
        {
          name: "/ping",
          value: "Responds with 'Pong!'",
        },
      ]);
    return interaction.reply({ embeds: [responseEmbed] });
  },
  run: async ({ msg }) => {
    const responseEmbed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("HELP")
      .setDescription(`Command information`)
      .setFields([
        {
          name: "!fd8 {characterName} {attackNotation}",
          value: "Responds with frame data for the given attack. (Tekken 8)",
        },
        {
          name: "!fd7 {characterName} {attackNotation}",
          value: "Responds with frame data for the given attack. (Tekken 7)",
        },
        {
          name: "!report {message}",
          value: "Send feedback about this bot.",
        },
        {
          name: "!help",
          value: "Replies with information for all commands.",
        },
        {
          name: "!support",
          value: "View how to support the creator of this bot.",
        },
        {
          name: "!ping",
          value: "Responds with 'Pong!'",
        },
      ]);
    return msg.reply({ embeds: [responseEmbed] });
  },
};
