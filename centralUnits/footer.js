const { ButtonBuilder, ButtonStyle } = require('discord.js');

const buttons = [
    new ButtonBuilder().setCustomId('next').setLabel('التالي').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('befor').setLabel('رجوع').setStyle(ButtonStyle.Secondary)
]

module.exports = { buttons };