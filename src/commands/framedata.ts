import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import "dotenv/config";
import { existsSync } from "fs";
import * as path from "path";
import { DiscordEmbedResponse } from "../types/responses";
import { COLORS, EMBED_FIELDS } from "../util/config";

const fd7Command = new SlashCommandBuilder()
  .setName("fd7")
  .setDescription("Look up framedata for a given TEKKEN 7 attack");

const fd8Command = new SlashCommandBuilder()
  .setName("fd8")
  .setDescription("Look up framedata for a given TEKKEN 8 attack");

const fdCommandCharacterOption = new SlashCommandStringOption()
  .setName("character")
  .setDescription("Character")
  .setRequired(true);

const fdCommandAttackOption = new SlashCommandStringOption()
  .setName("move")
  .setDescription("Attack")
  .setRequired(true);

@Discord()
export class Framedata {
  static readonly zeroWidthSpace: string = "​";
  static readonly BASE_API_URL?: string = process.env.BASE_API_URL;

  @Slash(fd7Command)
  fd7(
    @SlashOption(fdCommandCharacterOption)
    character: string,
    @SlashOption(fdCommandAttackOption)
    input: string,
    interaction: CommandInteraction
  ): void {
    Framedata.getFramedataEmbed(character, input, "tekken7").then((response) =>
      interaction.reply(response)
    );
  }

  @Slash(fd8Command)
  fd8(
    @SlashOption(fdCommandCharacterOption)
    character: string,
    @SlashOption(fdCommandAttackOption)
    input: string,
    interaction: CommandInteraction
  ): void {
    Framedata.getFramedataEmbed(character, input, "tekken8").then((response) =>
      interaction.reply(response)
    );
  }

  static async getFramedataEmbed(
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
      console.log(`Couldn't fetch API at all.`);
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
      console.log(`An API related error ocurred: ${errorMessage}`);
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
          value:
            similarMoveNames.length != 0 ? similarMoveNames : "None found.",
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
    const imageFilePath = path.join(__dirname, `./images/${characterCode}.png`);
    const fileExists = existsSync(imageFilePath);
    if (fileExists) {
      console.log(`Found image for character ${character}.`);
      const imageFile = new AttachmentBuilder(imageFilePath, {
        name: `${characterCode}.png`,
      });
      responseEmbed.setThumbnail(encodeURI(`attachment://${imageFile.name}`));
      imageFiles.push(imageFile);
    }

    console.log(`Sending response for ${character}'s ${inputString}`);
    return { embeds: [responseEmbed], files: imageFiles };
  }

  static async getCharacterCodeResponse(character: string) {
    try {
      return await fetch(
        `${this.BASE_API_URL}character-code/${character.toLowerCase()}`
      );
    } catch (err) {
      console.error(`An error ocurred when fetching character code: ${err}`);
      return null;
    }
  }

  static async getFramedataResponse(
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

  static validateEmbedFieldValue(input: string): string {
    if (!input || input.length <= 0) {
      return this.zeroWidthSpace;
    }
    return input;
  }
}
