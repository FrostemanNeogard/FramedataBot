// Require the getFiles function as well as fs for reading of our commands folder
const { getFiles } = require("../util/functions");
const fs = require("fs");

module.exports = (bot, reload) => {
  // Deconstruct client from bot
  const { client } = bot;

  // Read all subfolders within /commands
  fs.readdirSync("./commands/").forEach((category) => {
    // Save all commands in current subfolder
    let commands = getFiles(`./commands/${category}`, ".js");

    // Loop each file in commands and save it (or delete if we're reloading)
    commands.forEach((file) => {
      // Delete all loaded commands if we're reloading
      if (reload) {
        delete require.cache[
          require.resolve(`../commands/${category}/${file}`)
        ];
      }

      // Set the current command in the commands collection
      const command = require(`../commands/${category}/${file}`);
      client.commands.set(command.name, command);
    });
  });

  // Log activity
  console.log(`Loaded ${client.commands.size} commands.`);
};
