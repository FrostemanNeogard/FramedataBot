module.exports = {
  name: "fd",
  category: "tekken",
  permissions: [],
  devCommand: false,
  run: async ({ client, msg, args }) => {
    const cheerio = require("cheerio");
    const needle = require("needle");
    const { MessageEmbed } = require("discord.js");

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

        DB: "1'",
        D: "2'",
        DF: "3'",
        B: "4'",
        N: "5'",
        F: "6'",
        UB: "7'",
        U: "8'",
        UF: "9'",

        "1+2": "p",
        "3+4": "k",
        "1+3": "l",
        "2+4": "r",
        "1+4": "lpk",
        "2+3": "rpk",

        "1+2+3": "wplk",
        "1+3+4": "lpwk",
        "2+3+4": "rpwk",
        "1+2+4": "wprk",
        "1+2+3+4": "a",
      };
      const reverseInputFormattingMap = {};
      Object.keys(inputFormattingMap).forEach((key) => {
        reverseInputFormattingMap[inputFormattingMap[key]] = key;
      });

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

function getCharacterCode(character) {
  const characterCodes = {
    akuma: "akuma",
    alisa: "alisa",
    anna: "anna",
    armor_king: "armor-king",
    asuka: "asuka",
    bob: "bob",
    bryan: "bryan",
    claudio: "claudio",
    devil_jin: "devil-jin",
    dragunov: "dragunov",
    eddy: "eddy",
    eliza: "eliza",
    fahkumram: "fahkumram",
    feng: "feng",
    ganryu: "ganryu",
    geese: "geese",
    gigas: "gigas",
    heihachi: "heihachi",
    hwoarang: "hwoarang",
    jack_7: "jack7",
    jin: "jin",
    josie: "josie",
    julia: "julia",
    katarina: "katarina",
    kazumi: "kazumi",
    kazuya: "kazuya",
    king: "king",
    kuma: "kuma",
    panda: "kuma",
    kunimitsu: "kunimitsu",
    lars: "lars",
    law: "law",
    lee: "lee",
    lei: "lei",
    leo: "leo",
    leroy: "leroy",
    lidia: "lidia",
    lili: "lili",
    lucky_chloe: "lucky-chloe",
    marduk: "marduk",
    master_raven: "master-raven",
    miguel: "miguel",
    negan: "negan",
    nina: "nina",
    noctis: "noctis",
    paul: "paul",
    shaheen: "shaheen",
    steve: "steve",
    xiaoyu: "xiaoyu",
    yoshimitsu: "yoshimitsu",
    zafina: "zafina",
  };

  const characterMap = {
    gouki: characterCodes.akuma,
    akuma: characterCodes.akuma,
    aku: characterCodes.akuma,

    alisa: characterCodes.alisa,
    alis: characterCodes.alisa,
    als: characterCodes.alisa,

    anna: characterCodes.anna,
    ann: characterCodes.anna,

    armorking: characterCodes.armor_king,
    ak: characterCodes.armor_king,
    amk: characterCodes.armor_king,

    asuka: characterCodes.asuka,

    bob: characterCodes.bob,

    bryan: characterCodes.bryan,
    bry: characterCodes.bryan,
    brain: characterCodes.bryan,
    brian: characterCodes.bryan,

    claudio: characterCodes.claudio,
    cla: characterCodes.claudio,

    deviljin: characterCodes.devil_jin,
    devil: characterCodes.devil_jin,
    dj: characterCodes.devil_jin,

    dragunov: characterCodes.dragunov,
    drag: characterCodes.dragunov,
    dra: characterCodes.dragunov,

    eddy: characterCodes.eddy,
    eddie: characterCodes.eddy,
    edy: characterCodes.eddy,
    edd: characterCodes.eddy,

    eliza: characterCodes.eliza,
    liz: characterCodes.eliza,
    elisa: characterCodes.eliza,
    liza: characterCodes.eliza,
    elz: characterCodes.eliza,

    fahkumram: characterCodes.fahkumram,
    fahk: characterCodes.fahkumram,
    fak: characterCodes.fahkumram,
    fhk: characterCodes.fahkumram,

    feng: characterCodes.feng,
    fng: characterCodes.feng,

    ganryu: characterCodes.ganryu,
    ganny: characterCodes.ganryu,
    gan: characterCodes.ganryu,
    gry: characterCodes.ganryu,

    geese: characterCodes.geese,
    howard: characterCodes.geese,

    gigas: characterCodes.gigas,
    gigass: characterCodes.gigas,

    heihachi: characterCodes.heihachi,
    hei: characterCodes.heihachi,

    hwoarang: characterCodes.hwoarang,
    hwo: characterCodes.hwoarang,

    "jack-7": characterCodes.jack_7,
    jack: characterCodes.jack_7,
    jack7: characterCodes.jack_7,
    jack_7: characterCodes.jack_7,

    jin: characterCodes.jin,

    josie: characterCodes.josie,
    crybaby: characterCodes.josie,

    julia: characterCodes.julia,
    chang: characterCodes.julia,
    jul: characterCodes.julia,

    katarina: characterCodes.katarina,
    kat: characterCodes.katarina,

    kazumi: characterCodes.kazumi,
    kzm: characterCodes.kazumi,

    kaz: characterCodes.kazuya,
    kazuya: characterCodes.kazuya,

    king: characterCodes.king,

    kuma: characterCodes.kuma,
    panda: characterCodes.panda,
    bear: characterCodes.kuma,
    bears: characterCodes.kuma,

    kunimitsu: characterCodes.kunimitsu,
    kuni: characterCodes.kunimitsu,

    lars: characterCodes.lars,

    law: characterCodes.law,
    bruce_lee: characterCodes.law,
    "bruce-lee": characterCodes.law,

    lee: characterCodes.lee,

    lei: characterCodes.lei,
    jackie_chan: characterCodes.lei,
    "jackie-chan": characterCodes.lei,

    leo: characterCodes.leo,

    leroy: characterCodes.leroy,

    lidia: characterCodes.lidia,

    lili: characterCodes.lili,

    lucky_chloe: characterCodes.lucky_chloe,
    chloe: characterCodes.lucky_chloe,
    lucky: characterCodes.lucky_chloe,
    idol: characterCodes.lucky_chloe,

    marduk: characterCodes.marduk,
    duk: characterCodes.marduk,
    craig: characterCodes.marduk,

    master_raven: characterCodes.master_raven,
    "master-raven": characterCodes.master_raven,
    maven: characterCodes.master_raven,
    raven: characterCodes.master_raven,

    miguel: characterCodes.miguel,
    mig: characterCodes.miguel,

    negan: characterCodes.negan,

    nina: characterCodes.nina,

    noctis: characterCodes.noctis,

    paul: characterCodes.paul,

    shaheen: characterCodes.shaheen,

    steve: characterCodes.steve,
    boxer: characterCodes.steve,

    xiaoyu: characterCodes.xiaoyu,
    xioayu: characterCodes.xiaoyu,
    ling: characterCodes.xiaoyu,
    x: characterCodes.xiaoyu,

    yoshimitsu: characterCodes.yoshimitsu,
    yoshi: characterCodes.yoshimitsu,
    yosh: characterCodes.yoshimitsu,

    zafina: characterCodes.zafina,
    zaf: characterCodes.zafina,
  };

  character = character.toLowerCase();

  return characterMap[character];
}
