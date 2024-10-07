import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { COLORS, EMBED_FIELDS } from "../util/config";
import { DiscordEmbedResponse } from "../types/responses";
import { existsSync } from "fs";
import * as path from "path";

export class FramedataService {
  private readonly zeroWidthSpace: string = "​";
  private readonly BASE_API_URL?: string = process.env.BASE_API_URL;

  async getFramedataEmbed(
    character: string,
    inputs: string,
    gameCode: string
  ): Promise<DiscordEmbedResponse> {
    const characterCodeResponse = await this.getCharacterCodeResponse(
      gameCode,
      character
    );

    if (characterCodeResponse == null) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setDescription(
          "An error ocurred when attempting to fetch framedata. Please try again later."
        )
        .setColor(COLORS.danger);
      console.log(`Couldn't fetch API.`);
      return {
        embeds: [errorEmbed],
      };
    }

    const characterCodeData = await characterCodeResponse.json();

    if (characterCodeData.statusCode == 404) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("ERROR")
        .setDescription(
          `Couldn't find the character "${character}" for the given game.`
        )
        .setColor(COLORS.danger);
      return { embeds: [errorEmbed] };
    }

    const characterCode = characterCodeData.characterCode;

    const response = await this.getFramedataResponse(
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
      console.log(`Couldn't fetch data at all.`);
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
      console.log(`An API related error ocurred: ${data.message}`);
      return {
        embeds: [errorEmbed],
      };
    }

    if (data.length > 0) {
      const similarMoveNames =
        data
          .map(
            (move: { [key: string]: any }, index: number) =>
              `**${index + 1}:** ${move.input}`
          )
          .join("\n") ?? "None found";

      const warningEmbed = new EmbedBuilder()
        .setTitle(`Attack not found: ${inputs}`)
        .setFields({
          name: "Similar moves:",
          value: similarMoveNames.length > 0 ? similarMoveNames : "None found.",
        })
        .setColor(COLORS.warning);
      console.log(`Sending "Similar Moves" embed for ${character}'s ${inputs}`);
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

    const responseEmbed = new EmbedBuilder()
      .setTitle(characterCode.toUpperCase())
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
        }
      );

    if (note.length > 0) {
      console.log(`Adding ${note.length} notes`);
      responseEmbed.addFields({
        name: "Notes",
        value: this.validateEmbedFieldValue(
          `- ${note.split("\n").join("\n- ")}`
        ),
        inline: true,
      });
    }

    let imageFiles = [];
    const imageFilePath = path.join(
      __dirname,
      `../images/${gameCode}/${characterCode}.png`
    );
    const fileExists = existsSync(imageFilePath);
    if (fileExists) {
      console.log(`Found image for character ${character}.`);
      const imageFile = new AttachmentBuilder(imageFilePath, {
        name: `${characterCode}.png`,
      });
      responseEmbed.setThumbnail(encodeURI(`attachment://${imageFile.name}`));
      imageFiles.push(imageFile);
    }

    console.log(
      `Sending response for ${character}'s ${inputString} with image(s): ${imageFiles.map(
        (i) => i.name
      )}`
    );
    return { embeds: [responseEmbed], files: imageFiles };
  }

  private async getCharacterCodeResponse(gameCode: string, character: string) {
    const apiEndpoint = `${
      this.BASE_API_URL
    }charactercodes/${gameCode}/${character.toLowerCase()}`;

    console.log(`Fetching ${apiEndpoint} for getting character endpoint.`);

    try {
      return await fetch(apiEndpoint);
    } catch (err) {
      console.error(`An error ocurred when fetching character code: ${err}`);
      return null;
    }
  }

  private async getFramedataResponse(
    characterCode: any,
    gameCode: string,
    inputs: string
  ) {
    try {
      return await fetch(`${this.BASE_API_URL}framedata`, {
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

  private validateEmbedFieldValue(input: string): string {
    if (!input || input.length <= 0) {
      return this.zeroWidthSpace;
    }
    return input;
  }
}
