const {} = require('discord.js');
const praise = require('../../data/target/praise.json');
const { random } = require('../../centralUnits/randomItem.js');
const { ErrorUnit } = require('../../centralUnits/errorUnit.js');

module.exports = {
    name: ['مدح', 'امدح', 'إمدح'],
    async execute(msg, args){
        try {
            const user = msg.mentions.users.first();
            if(!user){
                await msg.channel.send({content: `${msg.author}\nيرجى استخدام الأمر بالشكل الصحيح: \`مدح @منشن\``});
                return;
            };

            const content = random(praise).lines.join('\n').replaceAll('{name}', `${user}`);
            await msg.channel.send(
                { content: `${msg.author}\n${content}\nتم المدح بنجاح 😘`}
            );
            return;
        } catch (error) {
            await ErrorUnit.throwError(error, msg, 'حدث خطأ أثناء تنفيذ الأمر مدح');
            return;
        }
    }
}

/*
,
    {
        "lines" :[
            "", "",
            "", "",
            "", "",
            "", ""
        ] 
    }

*/