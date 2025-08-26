const { Events } = require('discord.js');
const { ErrorUnit } = require('../centralUnits/errorUnit.js');

module.exports = {
    name:Events.InteractionCreate,
    on: true,
    async execute(interaction){
        if (!interaction.isChatInputCommand()) return;
        
        const command = interaction.client.commands.get(interaction.commandName);
        if(!command) return await interaction.reply(`لا يوجد امر بهذا الإسم: ${interaction.commandName}. <3`);

        try {
            command.execute(interaction);
        } catch (error) {
            await ErrorUnit(error, interaction, 'حدث خطأ أثناء توجيه الأمر');
            return;
        }
    }
}