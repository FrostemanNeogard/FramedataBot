import axios from "axios";
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
    Framedata.getFrameDataEmbedBuilder(character, input).then((embed) =>
      interaction.reply({ embeds: [embed] })
    );
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
    Framedata.getFrameDataEmbedBuilder(character, input).then((embed) =>
      interaction.reply({ embeds: [embed] })
    );
  }

  static async getFrameDataEmbedBuilder(
    character: string,
    inputs: string
  ): Promise<EmbedBuilder> {
    const response = await axios.post("http://localhost:3000/framedata", {
      characterCode: character,
      gameCode: "tekken8",
      input: inputs,
    });

    console.log(response.data);

    return new EmbedBuilder()
      .setTitle("Framedata")
      .setFields({ name: "one", value: "two" });
  }
}
