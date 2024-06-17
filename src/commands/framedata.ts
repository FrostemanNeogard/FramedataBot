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
import { DiscordEmbedResponse } from "../types/responses";
import { COLORS, EMBED_FIELDS } from "../util/config";

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
    Framedata.getFrameDataResponse(character, input, "tekken7").then(
      (response) => interaction.reply(response)
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
    Framedata.getFrameDataResponse(character, input, "tekken8").then(
      (response) => interaction.reply(response)
    );
  }

  static async getFrameDataResponse(
    character: string,
    inputs: string,
    gameCode: string
  ): Promise<DiscordEmbedResponse> {
    const characterCodeResponse = await Framedata.getCharacterCodeResponse(
      character
    );

    if (characterCodeResponse == null) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setDescription(
          "An error ocurred when attempting to fetch framedata. Please try again later."
        )
        .setColor(COLORS.danger);
      return {
        embeds: [errorEmbed],
      };
    }

    const characterCodeData = await characterCodeResponse.json();

    if (characterCodeData.status === 400) {
      const errorMessage = characterCodeData.message.replaceAll(
        "BadRequestException: ",
        ""
      );
      console.error(`Error: ${errorMessage}`);
      const errorEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setDescription("An error has ocurred");
      return { embeds: [errorEmbed] };
    }

    const characterCode = characterCodeData.characterCode;

    const response = await Framedata.getFramedataResponse(
      characterCode,
      gameCode,
      inputs
    );

    if (response == null) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setDescription(
          "An error ocurred when attempting to fetch framedata. Please try again later."
        )
        .setColor(COLORS.danger);
      return {
        embeds: [errorEmbed],
      };
    }

    const data = await response.json();

    if (data.status == 400) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setDescription(data.message.replaceAll("BadRequestException: ", ""))
        .setColor(COLORS.danger);
      return {
        embeds: [errorEmbed],
      };
    }

    if (data.length > 0) {
      const warningEmbed = new EmbedBuilder()
        .setTitle(`Attack not found: ${inputs}`)
        .setFields({
          name: "Similar moves:",
          value:
            data
              .map(
                (move: { [key: string]: any }, index: number) =>
                  `**${index + 1}:** ${move.input}`
              )
              .join("\n") ?? "None found",
        })
        .setColor(COLORS.warning);
      return {
        embeds: [warningEmbed],
      };
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

    let formattedNotes = note
      .replaceAll("\n\n\n", "\n")
      .replaceAll("\n\n", "\n")
      .replaceAll("\n \n", "\n")
      .replaceAll("\n", "\n- ");

    if (!formattedNotes.startsWith("\n")) {
      formattedNotes = `\n- ${formattedNotes}`;
    }

    if (formattedNotes.endsWith("\n- ")) {
      formattedNotes = formattedNotes.slice(0, -3);
    }

    const responseEmbed = new EmbedBuilder()
      .setTitle(character.toUpperCase())
      .setDescription(inputString)
      .setColor(COLORS.success)
      .setFooter({ text: EMBED_FIELDS.footer })
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
        {
          name: "Counter",
          value: this.validateEmbedFieldValue(counter),
          inline: true,
        },
        {
          name: "Notes",
          value: this.validateEmbedFieldValue(formattedNotes),
          inline: true,
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

    return { embeds: [responseEmbed], files: imageFiles };
  }

  static readonly zeroWidthSpace: string = "​";

  private static async getCharacterCodeResponse(character: string) {
    try {
      return await fetch(
        `http://localhost:3000/character-code/${character.toLowerCase()}`
      );
    } catch (err) {
      console.error(`An error ocurred when fetching character code: ${err}`);
      return null;
    }
  }

  private static async getFramedataResponse(
    characterCode: any,
    gameCode: string,
    inputs: string
  ) {
    try {
      return await fetch(`http://localhost:3000/framedata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterCode: characterCode,
          gameCode: gameCode,
          input: inputs,
        }),
      });
    } catch (err) {
      console.error(`An error ocurred when fetching framedata: ${err}`);
      return null;
    }
  }

  static validateEmbedFieldValue(input: string): string {
    if (!input || input.length <= 0) {
      return this.zeroWidthSpace;
    }
    return input;
  }
}
