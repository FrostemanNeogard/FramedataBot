// Import getFiles function
const { getFiles } = require("../util/functions");

module.exports = (bot, reload) => {
  // Deconstruct client from the bot
  const { client } = bot;

  // Get all the events using our getFiles function
  let events = getFiles("./events", ".js");

  // Log if there are no events to be loaded
  if (events.length == 0) {
    console.log("No events to load.");
  }

  // Loop through each event
  events.forEach((f, i) => {
    // If we reload, delete the loaded events
    if (reload) {
      delete require.cache[require.resolve(`../events/${f}`)];
    }

    // Save event to the event collection
    const event = require(`../events/${f}`);
    client.events.set(event.name, event);

    // If we do NOT reload, log
    if (!reload) {
      console.log(`${i + 1}. ${f} loaded.`);
    }
  });

  // Initialize event listeners if we are not reloading this command
  if (!reload) InitEvents(bot);
};

// Function to run specified events on bot startup
function TriggerEventHandler(bot, event, ...args) {
  // Deconstruct client from the bot
  const { client } = bot;

  // Try-catch statement that runs the current event only if it exists, otherwise throws error message
  try {
    if (client.events.has(event)) {
      client.events.get(event).run(bot, ...args);
    } else {
      throw new Error(`Event "${event}" does not exist.`);
    }
  } catch (err) {
    console.log(err);
  }
}

// Initialize events (currently the client wakeup event)
function InitEvents(bot) {
  const { client } = bot;

  client.on("ready", () => {
    TriggerEventHandler(bot, "ready");
  });

  client.on("messageCreate", (msg) => {
    TriggerEventHandler(bot, "messageCreate", msg);
  });
}
