const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "fd",
  category: "tekken",
  permissions: [],
  devCommand: false,
  data: new SlashCommandBuilder()
    .setName("fd")
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
    )
    .addStringOption((option) =>
      option
        .setName("gamecode")
        .setDescription(
          "(OPTINAL) Select which game to search for. Defaults to Tekken 8."
        )
        .setRequired(false)
        .addChoices(
          { name: "Tekken 7", value: "tekken7" },
          { name: "Tekken 8", value: "tekken8" }
        )
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
        gameCode: interaction.options.getString("gamecode"),
      };
      await this.run(data, true, data.gameCode || "tekken7");
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
    gameCode = "tekken7"
  ) => {
    try {
      if (args.length < 2) {
        console.error(`Missing args.`);
        return respond(
          msg,
          `Please provide a move in tekken notation along with the character. You can use the "help" command for additional details.`,
          slashCommand
        );
      }

      if (!slashCommand) {
        msg.react("👀");
      }
      const unformattedInputs = args.slice(1).join("");
      const fetch = (await import("node-fetch")).default;
      const characterCodeResponse = await fetch(
        `http://localhost:3000/character-code/${args[0]}`
      );

      if (characterCodeResponse.status === 400) {
        console.error("Couldn't find the given character.");
        if (!slashCommand) {
          msg.react("❌");
        }
        return respond(
          msg,
          `Couldn't find the given character: ${args[0]}.`,
          slashCommand
        );
      }

      const characterCodeData = await characterCodeResponse.json();
      const characterCode = characterCodeData.characterCode;
      const frameDataResponse = await fetch(`http://localhost:3000/framedata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterCode: characterCode,
          gameCode: gameCode,
          input: unformattedInputs,
        }),
      });
      const frameData = await frameDataResponse.json();

      if (frameData.status === 400) {
        console.error("Couldn't find the given move.");
        if (!slashCommand) {
          msg.react("❌");
        }
        return respond(
          msg,
          `Couldn't find the given move: ${args.slice(1)}.`,
          slashCommand
        );
      }

      const { input, hit_level, damage, startup, block, hit, counter, note } =
        frameData;

      const responseEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(characterCode.toUpperCase())
        .setDescription(`Move: ${input}`)
        .setFooter({
          text: `Please use the report command to submit any feedback you may have.`,
        });

      const fields = [
        { name: "Hit Level", value: hit_level, inline: true },
        { name: "Damage", value: damage, inline: true },
        { name: "Startup", value: startup, inline: true },
        { name: "Block", value: block, inline: true },
        { name: "Hit", value: hit, inline: true },
        { name: "Counter", value: counter, inline: true },
        { name: "Notes", value: note },
      ];

      fields.forEach((field) => {
        if (field.value !== undefined && field.value !== "") {
          responseEmbed.addFields({
            name: field.name,
            value: field.value,
            inline: field.inline,
          });
        }
      });

      if (!slashCommand) {
        msg.react("✅");
      }

      respond(msg, { embeds: [responseEmbed] }, slashCommand);
      return;
    } catch (error) {
      console.error("An error occurred:", error.message);
      respond(msg, "An error occurred. Please try again later.", slashCommand);
      return;
    }
  },
};

function respond(msg, reply, slashCommand) {
  console.log("Sending reply!");
  if (slashCommand == true) return msg.editReply(reply);
  else return msg.reply(reply);
}
