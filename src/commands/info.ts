import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { COLORS, getDefaultEmbed } from "../util/config";
import "dotenv/config";
const { OWNER_ID, TEST_GUILD_ID } = process.env;

@Discord()
export class Info {
  @Slash({
    description: "Get some help",
  })
  help(interaction: CommandInteraction) {
    const helpEmbed = getDefaultEmbed();
    helpEmbed
      .setTitle("HELP")
      .setDescription("Information about this bot and its commands.")
      .setFields(
        {
          name: "/fd8",
          value: "Responds with frame data for the given attack. (Tekken 8)",
        },
        {
          name: "/fd7",
          value: "Responds with frame data for the given attack. (Tekken 7)",
        },
        {
          name: "/report",
          value: "Send feedback about this bot.",
        },
        {
          name: "/help",
          value: "Replies with information for all commands.",
        },
        {
          name: "/support",
          value: "View how to support me as the creator of this bot.",
        }
      );
    interaction.reply({ embeds: [helpEmbed] });
  }

  @Slash({
    description: "Send a report about this bot.",
  })
  async report(
    @SlashOption({
      name: "message",
      description: "Message to send",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    message: string,
    interaction: CommandInteraction
  ) {
    try {
      await interaction.deferReply();
      const devServer = await interaction.client.guilds.cache.get(
        TEST_GUILD_ID ?? ""
      );
      if (!devServer) {
        throw new Error("Couldn't get server data.");
      }

      const feedbackReciever = await devServer.members.fetch(OWNER_ID ?? "");
      if (!feedbackReciever) {
        throw new Error("Couldn't get owner data.");
      }

      feedbackReciever.send(
        `Feedback recieved by ${interaction.user}: ${message}`
      );
      const successEmbed = getDefaultEmbed();
      successEmbed
        .setTitle("SUCCESS!")
        .setDescription("Your feedback has been sent, thank you!")
        .setFooter(null);
      interaction.editReply({ embeds: [successEmbed] });
    } catch (err) {
      console.error(
        err instanceof Error
          ? `Error ocurred when DMing owner: ${err.message}`
          : `Unknown error ocurred when DMing owner: ${err}`
      );
      const errorEmbed = getDefaultEmbed();
      errorEmbed
        .setTitle("ERROR.")
        .setColor(COLORS.danger)
        .setDescription("An error ocurred. Please try again later.");
      interaction.editReply({ embeds: [errorEmbed] });
    }
  }

  @Slash({
    description: "View how you can support the creator of this bot.",
  })
  support(interaction: CommandInteraction) {
    const supportEmbed = getDefaultEmbed();
    supportEmbed
      .setTitle("SUPPORT")
      .setDescription(
        "Here's how you can support me as the creator of this bot:"
      )
      .setFields([
        {
          name: "Follow me on Twitter!",
          value: "https://twitter.com/funnyorangcat",
        },
        {
          name: "Donate!",
          value: "https://www.buymeacoffee.com/funnyorangcat",
        },
      ])
      .setFooter({ text: "Every bit is greatly appreciated ❤" });
    interaction.reply({ embeds: [supportEmbed] });
  }
}
