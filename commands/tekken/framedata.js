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
    const characterCode = getCharacterCode(args[0]);
    if (!characterCode) {
      console.error(`Couldn't find character: ${args[0]}`);
      return msg.reply(`Couldn't find character: "${args[0]}".`);
    }
    if (args.length < 2) {
      console.error(`No notation given.`);
      return msg.reply("Please provide a move in tekken notation.");
    }

    const rbnURL = getRbnUrl(characterCode);
    console.log("Attempting to fetch data from:", rbnURL);

    needle.get(rbnURL, (err, res) => {
      if (err || res.statusCode !== 200) {
        console.error("Couldn't fetch data.");
        return msg.reply(
          "An error occurred when fetching data. Please try again later."
        );
      }

      const $ = cheerio.load(res.body, { decodeEntities: false });

      const unformattedInputs = args.slice(1).join("");

      let matchedInput = checkForInput($, unformattedInputs);
      if (matchedInput.length < 1) {
        matchedInput = checkForInput($, unformattedInputs, true);
      }

      const attackInfo = {
        input: matchedInput.find("td:eq(0)").text(),
        hitLevel: matchedInput.find("td:eq(1)").text(),
        damage: matchedInput.find("td:eq(2)").text(),
        startup: matchedInput.find("td:eq(3)").text(),
        block: matchedInput.find("td:eq(4)").text(),
        hit: matchedInput.find("td:eq(5)").text(),
        counter: matchedInput.find("td:eq(6)").text(),
        notes: matchedInput.find("td:eq(7)").text(),
      };

      if (matchedInput.length < 1) {
        console.error("Couldn't find the given move.");
        return msg.reply(`Couldn't find the given move: ${unformattedInputs}.`);
      }

      const formattedCharacterName = characterCode.toUpperCase();
      const responseEmbed = new MessageEmbed()
        .setColor(0x00ff00)
        .setTitle(formattedCharacterName)
        .setURL(rbnURL)
        .setDescription(`Move: ${attackInfo.input}`);

      const fields = [
        { name: "Hit Level", value: attackInfo.hitLevel, inline: true },
        { name: "Damage", value: attackInfo.damage, inline: true },
        { name: "Startup", value: attackInfo.startup, inline: true },
        { name: "Block", value: attackInfo.block, inline: true },
        { name: "Hit", value: attackInfo.hit, inline: true },
        { name: "Counter", value: attackInfo.counter, inline: true },
        { name: "Notes", value: attackInfo.notes },
      ];

      fields.forEach((field) => {
        if (field.value !== undefined && field.value !== "") {
          responseEmbed.addField(field.name, field.value, field.inline);
        }
      });

      responseEmbed.setFooter({
        text: `Please report any issues to "${process.env.OWNER_NAME}" on discord.`,
      });

      console.log("Replying with: ", responseEmbed);
      return msg.reply({ embeds: [responseEmbed] });
    });
  },
};

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

function getRbnUrl(characterCode) {
  const baseURL = `https://rbnorway.org/${characterCode}-t7-frames/`;
  return baseURL;
}
