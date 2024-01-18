const cheerio = require("cheerio");
const needle = require("needle");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const getCharacterCode = require("./config/config");

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
      };
      await this.run(data, true);
    } catch (error) {
      console.error("Something went wrong:", error);
      return interaction.editReply(
        "An error occurred. Please try again later."
      );
    }
  },
  run: async ({ client, msg, args }, slashCommand = false) => {
    try {
      if (args.length < 2) {
        console.log("Missing args.");
        return respond(
          msg,
          'Please provide a character and an attack in proper notation. Use the "!help" command for more info.',
          slashCommand
        );
      }

      // Get formatted character code
      const characterCode = getCharacterCode(args[0]);

      // Guard clause to check for non-existing characters
      if (!characterCode) {
        console.error(`Couldn't find character: ${args[0]}`);
        console.log("Couldn't find given character.");
        return respond(
          msg,
          `Couldn't find character: "${args[0]}".`,
          slashCommand
        );
      }

      // Guard clause to check for missing notation
      if (args.length < 2) {
        console.error(`No notation given.`);
        return respond(
          msg,
          "Please provide a move in tekken notation.",
          slashCommand
        );
      }

      // React to message to confirm everything went well
      if (!slashCommand) {
        msg.react("👀");
      }

      // Build RBNorway URL for character frames
      const rbnUrl = `https://rbnorway.org/${characterCode}-t7-frames/`;
      console.log("Attempting to fetch data from:", rbnUrl);

      // Fetch RBNorway data
      const { body, statusCode } = await needle("get", rbnUrl);

      // Guard clause if fetch was unsuccessful
      if (!body || statusCode !== 200) {
        console.error("Couldn't fetch data.");
        return respond(
          msg,
          "An error occurred when fetching data. Please try again later.",
          slashCommand
        );
      }

      // RBNorway body
      const $ = cheerio.load(body, { decodeEntities: false });

      // All args after the character name get stored as the unformatted inputs
      const unformattedInputs = args.slice(1).join("");

      // Attempt to find a matching input from RBNorway
      let matchedInputTr = checkForInput($, unformattedInputs);

      // If no matching input was found, look again with additional leniency
      if (matchedInputTr.length < 1) {
        matchedInputTr = checkForInput($, unformattedInputs, true);
      }

      // Guard clause to check if a matched input was found
      if (matchedInputTr.length < 1) {
        console.error("Couldn't find the given move.");
        if (!slashCommand) {
          msg.react("❌");
        }
        return respond(
          msg,
          `Couldn't find the given move: ${unformattedInputs}.`,
          slashCommand
        );
      }

      // Store all attack data
      const attackInfo = {
        input: matchedInputTr.find("td:eq(0)").text(),
        hitLevel: matchedInputTr.find("td:eq(1)").text(),
        damage: matchedInputTr.find("td:eq(2)").text(),
        startup: matchedInputTr.find("td:eq(3)").text(),
        block: matchedInputTr.find("td:eq(4)").text(),
        hit: matchedInputTr.find("td:eq(5)").text(),
        counter: matchedInputTr.find("td:eq(6)").text(),
        notes: matchedInputTr.find("td:eq(7)").text(),
      };

      // Create response embed
      const formattedCharacterName = characterCode.toUpperCase();
      const responseEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle(formattedCharacterName)
        .setURL(rbnUrl)
        .setDescription(`Move: ${attackInfo.input}`)
        .setFooter({
          text: `Please use the report command to submit any feedback you may have.`,
        });

      // Define fields for response embed
      const fields = [
        { name: "Hit Level", value: attackInfo.hitLevel, inline: true },
        { name: "Damage", value: attackInfo.damage, inline: true },
        { name: "Startup", value: attackInfo.startup, inline: true },
        { name: "Block", value: attackInfo.block, inline: true },
        { name: "Hit", value: attackInfo.hit, inline: true },
        { name: "Counter", value: attackInfo.counter, inline: true },
        { name: "Notes", value: attackInfo.notes },
      ];

      // Remove any fields with no value and add the remaining ones
      fields.forEach((field) => {
        if (field.value !== undefined && field.value !== "") {
          responseEmbed.addFields({
            name: field.name,
            value: field.value,
            inline: field.inline,
          });
        }
      });

      // Finally, respond with the generated embed
      if (!slashCommand) {
        msg.react("✅");
      }
      respond(msg, { embeds: [responseEmbed] }, slashCommand);
      return;
    } catch (error) {
      console.error("An error occurred:", error.message);
      return respond(
        msg,
        "An error occurred. Please try again later.",
        slashCommand
      );
    }
  },
};

function respond(msg, reply, slashCommand) {
  console.log("Reply sent!");
  if (slashCommand == true) return msg.editReply(reply);
  else return msg.reply(reply);
}

// Function to format tekken notation to allow for easier parsing
function formatNotation(inputNotation, removePlus) {
  let modifiedNotation = inputNotation
    .toLowerCase()

    // TODO: This is kinda stupid, maybe move the input shortcuts to a different function
    .replaceAll("cd", "f,n,d,df")
    .replaceAll("debug", "b,db,d,df")
    .replaceAll("gs", "f,n,b,db,d,df,f")
    .replaceAll("wr", "f,f,f")
    .replaceAll("qcf", "d,df,f")
    .replaceAll("qcb", "d,db,b")
    .replaceAll("hcf", "b,db,f,df,f")
    .replaceAll("hcb", "f,df,d,db,d")
    .replace(/ *\([^)]*\) */g, "")
    .split("or")
    .pop()
    .split("in rage")
    .pop()
    .replace(/[\s,+/()]/g, "");

  if (removePlus) {
    modifiedNotation = modifiedNotation.replace(/\+/g, "");
  }

  return modifiedNotation;
}

// Check the given <tr> element for any <td> that match the given input
function checkForInput($, unformattedInputs, removePlus = false) {
  const formattedInputs = formatNotation(unformattedInputs, removePlus);
  const attackRow = $("tr:has(td)")
    .filter((index, element) => {
      const tdText = $(element).find("td").first().text().trim().toLowerCase();
      return formatNotation(tdText, removePlus) == formattedInputs;
    })
    .first();

  return attackRow;
}
