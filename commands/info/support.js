const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "support",
  category: "info",
  permissions: [],
  devCommand: false,
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Responds with methods of supporting this bot's creator."),
  async execute(interaction) {
    const responseEmbed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("SUPPORT")
      .setDescription(
        `Thanks for showing interest in supporting me! Here's what you can do:`
      )
      .setFields([
        {
          name: "Follow me on Twitter!",
          value: "https://twitter.com/funnyorangcat",
        },
        {
          name: "Buy Me A Coffee (Donation)",
          value: "https://www.buymeacoffee.com/funnyorangcat",
        },
      ])
      .setFooter({ text: "Every bit is greatly appreciated ❤" });
    return interaction.reply({ embeds: [responseEmbed] });
  },
  run: async ({ client, msg, args }) => {
    const responseEmbed = new EmbedBuilder()
      .setColor(0x00ff00)
      .setTitle("SUPPORT")
      .setDescription(
        `Thanks for showing interest in supporting me! Here's what you can do:`
      )
      .setFields([
        {
          name: "Follow me on Twitter!",
          value: "https://twitter.com/funnyorangcat",
        },
        {
          name: "Buy Me A Coffee (Donation)",
          value: "https://www.buymeacoffee.com/funnyorangcat",
        },
      ])
      .setFooter({ text: "Every bit is greatly appreciated ❤" });
    return msg.reply({ embeds: [responseEmbed] });
  },
};
