// Set up the login token as well as the command prefix and owner ID
require("dotenv").config();
const TOKEN = process.env.TOKEN;
const prefix = process.env.PREFIX;
const OWNERID = process.env.OWNERID;

// Set up discord client (with intents due to API changes)
const Discord = require("discord.js");
const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
});

// Create bot object
// Contains the client as well as additional information for command prefix and the bot author's ID
let bot = {
  client,
  prefix: prefix,
  owner: OWNERID,
};

// Collections for commands and events
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload);
client.loadCommands = (bot, reload) =>
  require("./handlers/commands")(bot, reload);

// Run the functions created above
client.loadEvents(bot, false);
client.loadCommands(bot, false);

module.exports = bot;

// Client login
client.login(TOKEN);
