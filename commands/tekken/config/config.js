module.exports = function getCharacterCode(character) {
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

  const createAliasMap = (aliases, code) => {
    return aliases.reduce((map, alias) => {
      map[alias] = code;
      return map;
    }, {});
  };

  const characterMap = {
    ...createAliasMap(["akuma", "gouki", "aku"], characterCodes.akuma),
    ...createAliasMap(["alisa", "alis", "als"], characterCodes.alisa),
    ...createAliasMap(["anna", "ann"], characterCodes.anna),
    ...createAliasMap(
      ["armorking", "armor-king", "armor_king", "ak", "amk"],
      characterCodes.armor_king
    ),
    ...createAliasMap(["asuka"], characterCodes.asuka),
    ...createAliasMap(["bob"], characterCodes.bob),
    ...createAliasMap(["bryan", "bry", "brain", "brian"], characterCodes.bryan),
    ...createAliasMap(["claudio", "cla"], characterCodes.claudio),
    ...createAliasMap(
      ["devil-jin", "devil_jin", "deviljin", "devil", "dj"],
      characterCodes.devil_jin
    ),
    ...createAliasMap(["dragunov", "drag", "dra"], characterCodes.dragunov),
    ...createAliasMap(["eddy", "eddie", "edy", "edd"], characterCodes.eddy),
    ...createAliasMap(
      ["eliza", "liz", "elisa", "liza", "elz"],
      characterCodes.eliza
    ),
    ...createAliasMap(
      ["fahkumram", "fahk", "fak", "fhk"],
      characterCodes.fahkumram
    ),
    ...createAliasMap(["feng", "fng"], characterCodes.feng),
    ...createAliasMap(["ganryu", "gan", "gry"], characterCodes.ganryu),
    ...createAliasMap(["geese", "howard"], characterCodes.geese),
    ...createAliasMap(["gigas", "gigass"], characterCodes.gigas),
    ...createAliasMap(["heihachi", "hei"], characterCodes.heihachi),
    ...createAliasMap(["hwoarang", "hwo"], characterCodes.hwoarang),
    ...createAliasMap(
      ["jack", "jack7", "jack_7", "jack-7"],
      characterCodes.jack_7
    ),
    ...createAliasMap(["jin"], characterCodes.jin),
    ...createAliasMap(["josie", "crybaby"], characterCodes.josie),
    ...createAliasMap(["julia", "chang", "jul"], characterCodes.julia),
    ...createAliasMap(["katarina", "kat"], characterCodes.katarina),
    ...createAliasMap(["kazumi", "kzm"], characterCodes.kazumi),
    ...createAliasMap(["kazuya", "kaz"], characterCodes.kazuya),
    ...createAliasMap(["king"], characterCodes.king),
    ...createAliasMap(["kuma", "panda", "bear", "bears"], characterCodes.kuma),
    ...createAliasMap(["kunimitsu", "kuni"], characterCodes.kunimitsu),
    ...createAliasMap(["lars"], characterCodes.lars),
    ...createAliasMap(["law", "bruce_lee", "bruce-lee"], characterCodes.law),
    ...createAliasMap(["lee", "flower"], characterCodes.lee),
    ...createAliasMap(
      ["lei", "jackie_chan", "jackie-chan"],
      characterCodes.lei
    ),
    ...createAliasMap(["leo"], characterCodes.leo),
    ...createAliasMap(["leroy"], characterCodes.leroy),
    ...createAliasMap(["lidia"], characterCodes.lidia),
    ...createAliasMap(["lili"], characterCodes.lili),
    ...createAliasMap(
      ["luckychloe", "lucky-chloe", "lucky_chloe", "chloe", "lucky", "idol"],
      characterCodes.lucky_chloe
    ),
    ...createAliasMap(["marduk", "duk", "craig"], characterCodes.marduk),
    ...createAliasMap(
      ["masterraven", "master-raven", "maven", "raven"],
      characterCodes.master_raven
    ),
    ...createAliasMap(["miguel", "mig"], characterCodes.miguel),
    ...createAliasMap(["negan"], characterCodes.negan),
    ...createAliasMap(["nina"], characterCodes.nina),
    ...createAliasMap(["noctis"], characterCodes.noctis),
    ...createAliasMap(["paul"], characterCodes.paul),
    ...createAliasMap(["shaheen"], characterCodes.shaheen),
    ...createAliasMap(["steve", "boxer"], characterCodes.steve),
    ...createAliasMap(["xioayu", "ling", "x"], characterCodes.xiaoyu),
    ...createAliasMap(["yoshi", "yosh", "yos"], characterCodes.yoshimitsu),
    ...createAliasMap(["zafina", "zaf"], characterCodes.zafina),
  };

  character = character.toLowerCase();

  return characterMap[character];
};
