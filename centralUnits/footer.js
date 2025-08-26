const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const footer = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('next').setLabel('التالي').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('befor').setLabel('رجوع').setStyle(ButtonStyle.Secondary)
);

module.exports = { footer };