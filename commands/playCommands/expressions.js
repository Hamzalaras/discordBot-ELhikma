const { EmbedBuilder } = require('discord.js');
const { expressionScarping } = require('../../scarping/expression.js');
const persons = require('../../data/quotes/persons.json');
const subjects = require('../../data/quotes/subjects.json');
const { random } = require('../../centralUnits/usefulFenctions.js');
const { ErrorUnit } = require('../../centralUnits/errorUnit.js');

module.exports = {
    name: ['إقتباسات', 'الاقتباسات', 'اقتباس', 'اقتباسات', 'إقتباس', 'الإقتباسات'],
    async execute(msg, args){
        const thinking = await msg.channel.send('يتم البحث عن الإقتباس يرجى الانتظار... 🤔');
        try {
            const personOrSubject = args[1];
            const targetPersonOrSubject = personOrSubject ? 
                                          persons.find(person => person.name.includes(personOrSubject)) ??
                                          subjects.find(subject => subject.name.includes(personOrSubject)) :
                                          random(random([persons, subjects])) ;
            if(!targetPersonOrSubject){
                await thinking.delete();
                throw new RangeError(`لا يوجد اقتباس لطلبكم: ${args[1]} 🥲`);
            }
        
            const expression = await expressionScarping(random(targetPersonOrSubject.links));
            const photo = targetPersonOrSubject.photo

            const avatar = msg.client.user.displayAvatarURL({ dynamic: true, size: 1024 });
            const informationEmbed = new EmbedBuilder()
                                    .setAuthor({ name: `${msg.client.user.username}`, iconURL: `${avatar}`})
                                    .setThumbnail(photo)
                                    .setColor('DarkAqua')
                                    .setTitle('إقتباسات')
                                    .setDescription(`🤯إقتباس للمفكر: \*\*${expression.author}\*\* .\n🧠يندرج تحت موضوع: \*\*${expression.quoteSubject}\*\* .`);
            
            await thinking.edit({content: `${msg.author}`, embeds: [informationEmbed]});
            await msg.channel.send({content: `~ \*\*\"${expression.text}\"\*\* ~`});
            return;
                                          
        } catch (error) {
            await thinking.delete();
            await ErrorUnit.throwError(error, msg, 'حدث خطأ اثناء تنفيذ الأمر إقتباسات 🥲');
            return;
        }
    }
}