# Tekken Framedata Bot

This is a Discord bot which provides frame data for a given move of a specified character for Tekken 7 (and soon Tekken 8!).
All information is fetched from [RBNorway](https://rbnorway.org/t7-frame-data/) via web scraping and all credit for all the data goes entirely to them.

# Usage

1. Use [this link](https://discord.com/oauth2/authorize?client_id=1184848382720737310&permissions=0&response_type=code&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D1184848382720737310%26scope%3Dbot&scope=bot+messages.read) to invite the bot to your server.
2. Once the bot has joined your server, make sure it has the proper permissions needed to send and read messages in the channels you want to use it in.
3. Try it out!

# Commands

Note that all these commands are available as both slash commands (/) and regular prefix commands (!).

This is due to me personally preferring the speed of simply being able to type "!fd bryan df2" instead of using Discord's slash command functionality.

## Framedata

Syntax: `/fd {character_name} {attack_input_notation}`

Example: `/fd bryan df23`

Replies with a Discord embed containing data for the given move.

## Ping

Syntax: `/ping`

Replies with "Pong!". Can be used to make sure the bot is online.

## Help

Syntax: `/help`

Replies with a Discord embed containing information about all available commands.

## Report

Syntax: `/report {message}`

Sends your feedback to me so I can review it and fix any problems that may occur with the bot.
