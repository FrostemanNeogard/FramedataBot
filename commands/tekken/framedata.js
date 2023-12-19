const cheerio = require("cheerio");
const needle = require("needle");
const { MessageEmbed } = require("discord.js");
const getCharacterCode = require("./config");

module.exports = {
  name: "fd",
  category: "tekken",
  permissions: [],
  devCommand: false,
  run: async ({ client, msg, args }) => {
    // Get formatted character code
    const characterCode = getCharacterCode(args[0]);

    // Guard clause to check for non-existing characters
    if (!characterCode) {
      console.error(`Couldn't find character: ${args[0]}`);
      return msg.reply(`Couldn't find character: "${args[0]}".`);
    }

    // Guard clause to check for missing notation
    if (args.length < 2) {
      console.error(`No notation given.`);
      return msg.reply("Please provide a move in tekken notation.");
    }

    const rbnUrl = `https://rbnorway.org/${characterCode}-t7-frames/`;
    console.log("Attempting to fetch data from:", rbnUrl);

    // Fetch rbnUrl
    needle.get(rbnUrl, (err, res) => {
      // Guard clause if fetch was unsuccessful
      if (err || res.statusCode !== 200) {
        console.error("Couldn't fetch data.");
        return msg.reply(
          "An error occurred when fetching data. Please try again later."
        );
      }

      // RBNorway body
      const $ = cheerio.load(res.body, { decodeEntities: false });

      // All args after the character name get stored as the unformatted inputs
      const unformattedInputs = args.slice(1).join("");

      // Attempt to find a matching input from RBNorway
      let matchedInputTr = checkForInput($, unformattedInputs);

      // If not matching input was found, look again with additional leniency
      if (matchedInputTr.length < 1) {
        matchedInputTr = checkForInput($, unformattedInputs, true);
      }

      // Guard clause to check if a matched input was found
      if (matchedInputTr.length < 1) {
        console.error("Couldn't find the given move.");
        return msg.reply(`Couldn't find the given move: ${unformattedInputs}.`);
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
      const responseEmbed = new MessageEmbed()
        .setColor(0x00ff00)
        .setTitle(formattedCharacterName)
        .setURL(rbnUrl)
        .setDescription(`Move: ${attackInfo.input}`);

      responseEmbed.setFooter({
        text: `Please report any issues to "${process.env.OWNER_NAME}" on discord.`,
      });

      const fields = [
        { name: "Hit Level", value: attackInfo.hitLevel, inline: true },
        { name: "Damage", value: attackInfo.damage, inline: true },
        { name: "Startup", value: attackInfo.startup, inline: true },
        { name: "Block", value: attackInfo.block, inline: true },
        { name: "Hit", value: attackInfo.hit, inline: true },
        { name: "Counter", value: attackInfo.counter, inline: true },
        { name: "Notes", value: attackInfo.notes },
      ];

      // Remove any fields with no value
      fields.forEach((field) => {
        if (field.value !== undefined && field.value !== "") {
          responseEmbed.addField(field.name, field.value, field.inline);
        }
      });

      // Finally, respond with the generated embed
      console.log("Replying with: ", responseEmbed);
      return msg.reply({ embeds: [responseEmbed] });
    });
  },
};

// Function to format tekken notation to allow for easier parsing
function formatNotation(inputNotation, removePlus) {
  let modifiedNotation = inputNotation;
  modifiedNotation = modifiedNotation.replace(/ *\([^)]*\) */g, "");
  modifiedNotation = modifiedNotation.toLowerCase();
  modifiedNotation = modifiedNotation.split("or");
  modifiedNotation =
    modifiedNotation.length === 0
      ? modifiedNotation[0]
      : modifiedNotation[modifiedNotation.length - 1];
  modifiedNotation = modifiedNotation.split("in rage");
  modifiedNotation =
    modifiedNotation.length === 0
      ? modifiedNotation[0]
      : modifiedNotation[modifiedNotation.length - 1];
  modifiedNotation = modifiedNotation.replaceAll(" ", "");
  modifiedNotation = modifiedNotation.replaceAll(",", "");
  modifiedNotation = modifiedNotation.replaceAll("/", "");
  if (removePlus) {
    modifiedNotation = modifiedNotation.replaceAll("+", "");
  }
  return modifiedNotation;
}

// Check the given <tr> element for any <td> that match the given input
function checkForInput($, unformattedInputs, removePlus = false) {
  const formattedInputs = formatNotation(unformattedInputs, removePlus);
  const attackRow = $("tr:has(td)")
    .filter((index, element) => {
      let tdText = $(element).find("td").first().text().trim().toLowerCase();
      tdText = formatNotation(tdText, removePlus);
      return tdText == formattedInputs;
    })
    .first();
  return attackRow;
}
