const { EmbedBuilder } = require('discord.js');
const { random } = require('../../centralUnits/usefulFenctions.js');
const proverbs = require('../../data/proverbs.json');
const { ErrorUnit, RandomErrors } = require('../../centralUnits/errorUnit.js');

function getPart(countryOrPart) { 
    const pathTo = [];
    proverbs.forEach((proverb, countryIndex) => {
        proverb.data.forEach((part, partIndex) => {
            if(part.part.includes(countryOrPart)) pathTo.push({
                countryIndex, partIndex
            })
        })
    });
    if(pathTo.length === 0) return undefined;
    const randomPath = random(pathTo);
    const part = proverbs[randomPath.countryIndex].data[randomPath.partIndex];
    part.country = proverbs[randomPath.countryIndex].country[0];

    return part ;
}   

module.exports = {
    name: [ 'أمثال', 'امثال', 'مثل', 'مقولة', 'مقوله', 'قول', 'اقوال', 'أقوال', 'قالوا'],
    async execute(msg, args){
        try {
            const countryOrPart = args[1];
            const item = proverbs.find(item => item.country.includes(countryOrPart));
            let part = countryOrPart ?
                                  (item?.data ? random(item.data) : getPart(countryOrPart)) :
                                  random(random(proverbs).data) ;

            if(!part) throw new RandomErrors(`لم يتم العثور على طلبكم: \*\*${countryOrPart}\*\* 🥲`);

            const randomsection = random(part.sections)
            const randomProverb = random(randomsection.proverbs);

            const country = part.country ?? item?.country[0] ?? 'غير محدد';

            const avatar = msg.client.user.displayAvatarURL({ dynamic: true, size: 1024 });
            const informationEmbed = new EmbedBuilder()
                                        .setAuthor({ name: `${msg.client.user.username}`, iconURL: `${avatar}`})
                                        .setColor('DarkAqua')
                                        .setTitle('مثل شعبي')
                                        .setDescription(`📜مثل شعبي من: \*\*${country}\*\* .\n🧠يندرج تحت موضوع: \*\*${part.part[0]}\*\*، 🚪من باب: \*\*${randomsection.name}\*\* . \n\n`)
                                        .addFields(
                                            { name: `المثل الشعبي:`, value: `${randomProverb.proverb}`},
                                            { name: `بالفصحة:`, value: `${randomProverb.version}`},
                                            { name: `الشرح:`, value: `${randomProverb.explication}`}
                                        );
            await msg.channel.send({content: `${msg.author}`, embeds: [informationEmbed]});                    
            return; 
        } catch (error) {
            await ErrorUnit.throwError(error, msg, 'حدث خطأ أثناء تنفيذ الأمر \`أمثال\` 🥲');
            return;
        }
    }
}