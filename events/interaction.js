const { Events } = require('discord.js');
const { ErrorUnit, RandomErrors } = require('../centralUnits/errorUnit.js');

module.exports = {
    name:Events.InteractionCreate,
    on: true,
    async execute(interaction){
        try {
            if (!interaction.isChatInputCommand()) return;
            
            const command = interaction.client.commands.get(interaction.commandName);
            if(!command) throw new RandomErrors(`لا يوجد امر بهذا الإسم: \*\*${interaction.commandName}\*\* 🥲`);

            await command.execute(interaction);
            return;
        } catch (error) {
            await ErrorUnit(error, interaction, 'حدث خطأ أثناء توجيه الأمر 🥲');
            return;
        }
    }
}