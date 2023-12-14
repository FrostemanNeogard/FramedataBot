module.exports = {
  name: "ping",
  category: "info",
  permissions: [],
  devCommand: false,
  run: async ({ client, msg, args }) => {
    // Reply with "Pong!"
    return msg.reply("Pong!");
  },
};
