# Tekken Framedata Bot

This is a Discord bot which provides frame data for a given move of a specified character for Tekken 7.
All information is fetched from [RBNorway](https://rbnorway.org/t7-frame-data/) via web scraping and all credit for data goes to them.

## Usage

You can use [this link](https://discord.com/api/oauth2/authorize?client_id=1184848382720737310&permissions=67584&scope=bot) to invite the bot to your server.

## Commands

### Framedata: `!fd`

Syntax: `!fd {character_name} {attack_input_notation}`

Example: `!fd bryan df23`

Replies with a Discord embed containing data for the given move.

### Ping `!ping`

Syntax: `!ping`

Replies with "Pong!". Can be used to make sure the bot is working.
