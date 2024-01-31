const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "fd7",
  category: "tekken",
  permissions: [],
  devCommand: false,
  data: new SlashCommandBuilder()
    .setName("fd7")
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
        `http://localhost:3000/character-code/${args[0].toLowerCase()}`
      );

      const characterCodeData = await characterCodeResponse.json();

      if (characterCodeData.status === 400) {
        const errorMessage = characterCodeData.message.replaceAll(
          "BadRequestException: ",
          ""
        );
        console.error(`Error: ${errorMessage}`);
        if (!slashCommand) {
          msg.react("❌");
        }
        return respond(msg, `Error: ${errorMessage}`, slashCommand);
      }

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
        const errorMessage = frameData.message.replaceAll(
          "BadRequestException: ",
          ""
        );
        console.error(`Error: ${errorMessage}`);
        if (!slashCommand) {
          msg.react("❌");
        }
        return respond(msg, `Error: ${errorMessage}`, slashCommand);
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

      let imageFiles = [];
      const imageFilePath = path.join(
        __dirname,
        `./images/${characterCode}.png`
      );
      const fileExists = fs.existsSync(imageFilePath);
      if (fileExists) {
        const imageFile = new AttachmentBuilder(imageFilePath, {
          name: `${characterCode}.png`,
        });
        responseEmbed.setThumbnail(encodeURI(`attachment://${imageFile.name}`));
        imageFiles.push(imageFile);
      }

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

      respond(
        msg,
        { embeds: [responseEmbed], files: imageFiles },
        slashCommand
      );
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
