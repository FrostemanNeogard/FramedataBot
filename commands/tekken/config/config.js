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
    ...createAliasMap(
      ["alisa", "alis", "als", "alisa bosconovitch", "bosconovitch"],
      characterCodes.alisa
    ),
    ...createAliasMap(
      ["anna", "ann", "anna williams", "williams2", "williams 2"],
      characterCodes.anna
    ),
    ...createAliasMap(
      ["armorking", "armor-king", "armor_king", "ak", "amk", "armor king"],
      characterCodes.armor_king
    ),
    ...createAliasMap(["asuka", "asuka kazama"], characterCodes.asuka),
    ...createAliasMap(
      ["bob", "richards", "bob richards", "robert"],
      characterCodes.bob
    ),
    ...createAliasMap(
      ["bryan", "bry", "brain", "brian", "fury", "bryan fury"],
      characterCodes.bryan
    ),
    ...createAliasMap(
      ["claudio", "cla", "serafino", "claudio serafino"],
      characterCodes.claudio
    ),
    ...createAliasMap(
      [
        "devil-jin",
        "devil_jin",
        "deviljin",
        "devil",
        "dj",
        "devil jin",
        "d jin",
        "dvj",
      ],
      characterCodes.devil_jin
    ),
    ...createAliasMap(
      ["dragunov", "drag", "dra", "sergei", "sergei dragunov"],
      characterCodes.dragunov
    ),
    ...createAliasMap(
      ["eddy", "eddie", "edy", "edd", "eddy gordo"],
      characterCodes.eddy
    ),
    ...createAliasMap(
      ["eliza", "liz", "elisa", "liza", "elz"],
      characterCodes.eliza
    ),
    ...createAliasMap(
      ["fahkumram", "fahk", "fak", "fhk"],
      characterCodes.fahkumram
    ),
    ...createAliasMap(["feng", "fng", "wei", "feng wei"], characterCodes.feng),
    ...createAliasMap(["ganryu", "gan", "gry"], characterCodes.ganryu),
    ...createAliasMap(
      ["geese", "howard", "geese howard"],
      characterCodes.geese
    ),
    ...createAliasMap(["gigas", "gigass"], characterCodes.gigas),
    ...createAliasMap(
      ["heihachi", "hei", "hei mishima", "heihachi mishima"],
      characterCodes.heihachi
    ),
    ...createAliasMap(["hwoarang", "hwo"], characterCodes.hwoarang),
    ...createAliasMap(
      ["jack", "jack7", "jack_7", "jack-7", "jack 7"],
      characterCodes.jack_7
    ),
    ...createAliasMap(["jin", "jin kazama"], characterCodes.jin),
    ...createAliasMap(
      ["josie", "crybaby", "josie rizal", "rizal"],
      characterCodes.josie
    ),
    ...createAliasMap(
      ["julia", "chang", "jul", "julia chang"],
      characterCodes.julia
    ),
    ...createAliasMap(
      ["katarina", "kat", "alvez", "katarina alvez", "kat alvez"],
      characterCodes.katarina
    ),
    ...createAliasMap(
      ["kazumi", "kzm", "kazumi mishima"],
      characterCodes.kazumi
    ),
    ...createAliasMap(
      ["kazuya", "kaz", "kaz mishima", "kazuya mishima"],
      characterCodes.kazuya
    ),
    ...createAliasMap(["king"], characterCodes.king),
    ...createAliasMap(["kuma", "panda", "bear", "bears"], characterCodes.kuma),
    ...createAliasMap(["kunimitsu", "kuni"], characterCodes.kunimitsu),
    ...createAliasMap(
      ["lars", "alexandersson", "lars alexandersson"],
      characterCodes.lars
    ),
    ...createAliasMap(
      ["law", "bruce_lee", "bruce-lee", "marshall", "marshall law"],
      characterCodes.law
    ),
    ...createAliasMap(
      [
        "lee",
        "flower",
        "chaolan",
        "lee chaolan",
        "chaobla",
        "top 4",
        "lei chaobla",
      ],
      characterCodes.lee
    ),
    ...createAliasMap(
      ["lei", "jackie_chan", "jackie-chan", "wulong", "lei wulong"],
      characterCodes.lei
    ),
    ...createAliasMap(["leo", "kliesen", "leo kliesen"], characterCodes.leo),
    ...createAliasMap(["leroy", "leroy smith"], characterCodes.leroy),
    ...createAliasMap(
      ["lidia", "sobieska", "lidia sobieska"],
      characterCodes.lidia
    ),
    ...createAliasMap(
      ["lili", "rochefort", "lili de rochefort", "lili rochefort"],
      characterCodes.lili
    ),
    ...createAliasMap(
      [
        "luckychloe",
        "lucky-chloe",
        "lucky_chloe",
        "chloe",
        "lucky",
        "idol",
        "lucky chole",
        "l chloe",
      ],
      characterCodes.lucky_chloe
    ),
    ...createAliasMap(
      ["marduk", "duk", "craig", "craig marduk"],
      characterCodes.marduk
    ),
    ...createAliasMap(
      ["masterraven", "master-raven", "maven", "raven", "master raven"],
      characterCodes.master_raven
    ),
    ...createAliasMap(
      [
        "miguel",
        "mig",
        "caballero",
        "rojo",
        "miguel caballero",
        "miguel caballero rojo",
        "caballero rojo",
      ],
      characterCodes.miguel
    ),
    ...createAliasMap(["negan", "negan smith"], characterCodes.negan),
    ...createAliasMap(
      ["nina", "nina williams", "williams1", "williams 1"],
      characterCodes.nina
    ),
    ...createAliasMap(
      [
        "noctis",
        "lucis",
        "caelum",
        "lucis caelum",
        "noctis caelum",
        "noctis lucis",
        "noctis lucis caelum",
        "calcium",
        "noctis calcium",
      ],
      characterCodes.noctis
    ),
    ...createAliasMap(["paul", "phoenix", "paul phoenix"], characterCodes.paul),
    ...createAliasMap(["shaheen", "sha"], characterCodes.shaheen),
    ...createAliasMap(
      ["steve", "boxer", "steve fox", "fox"],
      characterCodes.steve
    ),
    ...createAliasMap(
      ["xioayu", "ling", "x", "ling xiaoyu"],
      characterCodes.xiaoyu
    ),
    ...createAliasMap(
      ["yoshi", "yosh", "yos", "yoshimitsu"],
      characterCodes.yoshimitsu
    ),
    ...createAliasMap(["zafina", "zaf"], characterCodes.zafina),
  };

  character = character.toLowerCase();

  return characterMap[character];
};
