import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import "dotenv/config";
import { existsSync } from "fs";
import * as path from "path";

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
    const characterCode = character;

    const response = await fetch(`http://localhost:3000/framedata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterCode: characterCode,
        gameCode: "tekken8",
        input: inputs,
      }),
    });

    const data = await response.json();

    if (response.status != 201) {
      return new EmbedBuilder().setTitle("Error").setFields({
        name: "An error ocurred",
        value: data.message ?? "Unknown error.",
      });
    }

    const {
      name,
      input,
      hit_level,
      damage,
      startup,
      block,
      hit,
      counter,
      note,
    } = data;

    const inputString = name ? `${input} (${name})` : input;

    const responseEmbed = new EmbedBuilder()
      .setTitle(character.toUpperCase())
      .setDescription(inputString)
      .setFields(
        {
          name: "Hit Level",
          value: this.validateEmbedFieldValue(hit_level),
          inline: true,
        },
        {
          name: "Damage",
          value: this.validateEmbedFieldValue(damage),
          inline: true,
        },
        {
          name: "Startup",
          value: this.validateEmbedFieldValue(startup),
          inline: true,
        },
        {
          name: "Block",
          value: this.validateEmbedFieldValue(block),
          inline: true,
        },
        { name: "Hit", value: this.validateEmbedFieldValue(hit), inline: true },
        { name: "Counter", value: this.validateEmbedFieldValue(counter) },
        {
          name: "Notes",
          value: this.validateEmbedFieldValue(note),
        }
      );

    let imageFiles = [];
    const imageFilePath = path.join(__dirname, `./images/${characterCode}.png`);
    const fileExists = existsSync(imageFilePath);
    if (fileExists) {
      const imageFile = new AttachmentBuilder(imageFilePath, {
        name: `${characterCode}.png`,
      });
      responseEmbed.setThumbnail(encodeURI(`attachment://${imageFile.name}`));
      imageFiles.push(imageFile);
    }

    return responseEmbed;
  }

  static readonly zeroWidthSpace: string = "​";

  static validateEmbedFieldValue(input: string): string {
    if (!input || input.length <= 0) {
      return this.zeroWidthSpace;
    }
    return input;
  }
}
