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
      .setDescription(`Command information`)
      .setFields([
        {
          name: "/fd7 {characterName} {attackNotation}",
          value: "Responds with frame data for the given attack. (Tekken 7)",
        },
        {
          name: "/fd8 {characterName} {attackNotation}",
          value: "Responds with frame data for the given attack. (Tekken 8)",
        },
        {
          name: "/report {message}",
          value: "Send feedback about this bot.",
        },
        {
          name: "/help",
          value: "Replies with information for all commands.",
        },
        {
          name: "/ping",
          value: "Responds with 'Pong!'",
        },
      ])
      .setFooter({
        text: `NOTE: These commands are all available as ! commands as well.`,
      });
    return interaction.reply({ embeds: [responseEmbed] });
  },
  run: async ({ msg }) => {
    const responseEmbed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("HELP")
      .setDescription(`Command information`)
      .setFields([
        {
          name: "!fd7 {characterName} {attackNotation}",
          value: "Responds with frame data for the given attack. (Tekken 7)",
        },
        {
          name: "!fd8 {characterName} {attackNotation}",
          value: "Responds with frame data for the given attack. (Tekken 8)",
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
          name: "!ping",
          value: "Responds with 'Pong!'",
        },
      ])
      .setFooter({
        text: `NOTE: These commands are all available as slash commands as well.`,
      });
    return msg.reply({ embeds: [responseEmbed] });
  },
};
