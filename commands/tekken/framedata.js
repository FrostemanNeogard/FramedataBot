module.exports = {
  name: "fd",
  category: "tekken",
  permissions: [],
  devCommand: false,
  run: async ({ client, msg, args }) => {
    const cheerio = require("cheerio");
    const needle = require("needle");

    const characterCode = getCharacterCode(args[0]);
    // const geppoURL = getGeppoUrl(characterCode);
    const geppoUrl =
      "https://geppopotamus.info/game/tekken7fr/bryan/data_en.htm#page_top";

    console.log("Attempting to fetch data...");
    needle.get(geppoUrl, (err, res) => {
      if (err || res.statusCode !== 200) {
        return msg.reply(
          "An error occurred when fetching data. Please try again later."
        );
      }

      let $ = cheerio.load(res.body, { decodeEntities: false });

      const inputFormattingMap = {
        1: "lp",
        2: "rp",
        3: "lk",
        4: "rk",
        db: "1",
        d: "2",
        df: "3",
        b: "4",
        n: "5",
        f: "6",
        ub: "7",
        u: "8",
        uf: "9",
      };
      const reverseInputFormattingMap = {};
      Object.keys(inputFormattingMap).forEach((key) => {
        reverseInputFormattingMap[inputFormattingMap[key]] = key;
      });

      const unformattedInputs = args.slice(1);
      const formattedInputs = unformattedInputs.map(
        (element) => `../${inputFormattingMap[element]}.gif`
      );
      console.log("Inputs:", formattedInputs);

      const searchQuery = formattedInputs
        .map((gifName) => {
          return `img[src="${gifName}"]`;
        })
        .join(" + ");

      const attackRow = $(
        `table.fr tr:has(td.td_label ${searchQuery})`
      ).first();
      const attackName = attackRow.find("td.td_label > span").text();
      const attackInputElements = attackRow.find(
        "td.td_label div.command_line img"
      );
      const attackInputs = [];
      for (input of attackInputElements) {
        const gifName = $(input).attr("src");
        const formattedGifName = gifName.substring(3, gifName.length - 4);
        attackInputs.push(reverseInputFormattingMap[formattedGifName]);
      }

      const attackStartup = attackRow.find("td.td_value").first().text();
      const attackBlock = attackRow.find("td.td_value:eq(1)").text();
      const attackHit = attackRow.find("td.td_value:eq(2)").text();
      const attackCounter = attackRow.find("td.td_value:eq(3)").text();
      const attackNotes = attackRow
        .find("td")
        .last()
        .clone()
        .find("div.uaccbox")
        .remove()
        .end()
        .text();

      const response = [
        `Name: ${attackName}`,
        `Input: ${attackInputs}`,
        `Startup: ${attackStartup}`,
        `On Block: ${attackBlock}`,
        `On Hit: ${attackHit}`,
        `On Counter: ${attackCounter}`,
        `Notes: ${attackNotes}`,
      ];
      return msg.reply(response.join("\n") ?? "No data found.");
    });

    return;
  },
};

// function getGeppoUrl(characterCode) {
//   var baseURL = `https://geppopotamus.info/game/tekken7fr/${characterCode}/data_en.htm#page_top`;
//   return baseURL;
// }

function getCharacterCode(character) {
  switch (character) {
    case ("armorking", "ak", "amk"):
      return "amking";
    default:
      return "bryan";
  }
}
