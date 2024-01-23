const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { run: frameDataRun } = require("./framedata");

module.exports = {
  name: "fd8",
  category: "tekken",
  permissions: [],
  devCommand: false,
  data: new SlashCommandBuilder()
    .setName("fd8")
    .setDescription("Look up framedata for a given tekken move.")
    .addStringOption((option) =>
      option
        .setName("character")
        .setDescription("Character name")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("notation")
        .setDescription(
          "Attack in Tekken notation. Example: Forward right punch = f+2."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const data = {
        msg: interaction,
        args: [
          interaction.options.getString("character"),
          interaction.options.getString("notation"),
        ],
        gameCode: interaction.options.getString("game"),
      };
      await this.run(data, true, data.gameCode || "tekken8");
    } catch (error) {
      console.error("Something went wrong:", error);
      return interaction.editReply(
        "An error occurred. Please try again later."
      );
    }
  },
  run: async (
    { client, msg, args },
    slashCommand = false,
    gameCode = "tekken8"
  ) => {
    await frameDataRun({ client, msg, args }, slashCommand, "tekken8");
    return;
  },
};
