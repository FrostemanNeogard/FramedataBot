const { SlashCommandBuilder } = require("discord.js");
const { owner_id } = require("../../config.json");

module.exports = {
  name: "report",
  category: "misc",
  permissions: [],
  devCommand: false,
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report feedback about this bot.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Feedback message to send.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const feedback = interaction.options.getString("message");
    const feedbackReciever = await client.users.fetch(owner_id, false);
    feedbackReciever.send(
      `Feedback recieved by ${interaction.user.username} (${interaction.user.id}): ${feedback}`
    );
    return interaction.reply("Your feedback has been sent!");
  },
  run: async ({ client, msg, args }) => {
    const feedback = msg.content;
    const feedbackReciever = await client.users.fetch(owner_id, false);
    feedbackReciever.send(`Feedback recieved by ${msg.author}: ${feedback}`);
    return msg.reply("Your feedback has been sent!");
  },
};
