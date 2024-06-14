import {
  ApplicationCommandOptionType,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import "dotenv/config";

@Discord()
export class Framedata {
  @Slash({
    description: `Get framedata for t7`,
  })
  fd7(
    @SlashOption({
      name: `character`,
      description: `Character`,
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    character: string,
    @SlashOption({
      name: `move`,
      description: `Attack`,
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    input: string,
    interaction: CommandInteraction
  ): void {
    const responseEmbed = Framedata.getFrameDataEmbedBuilder(character, input);
    interaction.reply({ embeds: [responseEmbed] });
    return;
  }

  @Slash({
    description: `Get framedata for t8`,
  })
  fd8(
    @SlashOption({
      name: `character`,
      description: `Character`,
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    character: string,
    @SlashOption({
      name: `move`,
      description: `Attack`,
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    input: string,
    interaction: CommandInteraction
  ): void {
    const responseEmbed = Framedata.getFrameDataEmbedBuilder(character, input);
    interaction.reply({ embeds: [responseEmbed] });
    return;
  }

  static getFrameDataEmbedBuilder(
    character: string,
    inputs: string
  ): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle("Framedata")
      .addFields(
        { name: "Character", value: character },
        { name: "Inputs", value: inputs }
      );
  }
}
