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
    const data = { msg: interaction };
    await this.run(data);
  },
  run: async ({ msg }) => {
    const responseEmbed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("HELP")
      .setDescription(`Command information`)
      .setFields([
        {
          name: "!fd {characterName} {attackNotation}",
          value:
            "Responds with frame data for the given attack. (Tekken 8 data will be added as soon as possible)",
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
        text: `Please use the "!report" command to submit any feedback you have.`,
      });
    return msg.reply({ embeds: [responseEmbed] });
  },
};
