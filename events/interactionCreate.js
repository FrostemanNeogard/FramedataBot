module.exports = {
  name: "interactionCreate",
  run: async (bot, interaction) => {
    const { client } = bot;

    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Command not found: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "An error occurred when trying to execute this command.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "An error occurred when trying to execute this command.",
          ephemeral: true,
        });
      }
    }
  },
};
