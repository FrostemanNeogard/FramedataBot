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
};
