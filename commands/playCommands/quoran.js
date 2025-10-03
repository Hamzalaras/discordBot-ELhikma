const { EmbedBuilder, ComponentType, ActionRowBuilder } = require('discord.js');
const quoran = require('../../data/quoran.json');
const { buttons } = require('../../centralUnits/footer.js');
const { poemDisplay, fetching } = require('../../centralUnits/usefulFenctions.js');
const { ErrorUnit, FalseInput, RandomErrors } = require('../../centralUnits/errorUnit.js');

module.exports = {
    name: ['سورة', 'سوره'],
    async execute(msg, args){
        try {
            const [surrah, ayah] = [args[1], args[2]];
            const surrahNum = surrah ?
                            isNaN(surrah) ?
                            quoran[surrah] ??
                            null :
                            surrah :
                            Math.floor(Math.random() * 114) + 1;
            if(!surrahNum || surrahNum > 114 || surrahNum < 1) throw new FalseInput('سورة'); 
  
            const url = !isNaN(ayah) ? 
                        `http://api.alquran.cloud/v1/ayah/${surrahNum}:${ayah}` : 
                        `http://api.alquran.cloud/v1/surah/${surrahNum}` ;

            const res = await fetching(url);            
            if(res.status === 'NOT FOUND'){
                throw new RandomErrors('يرجى ادخال معلومات صحيحة!! 😘');
            }else if(res.status !== 'OK'){
                throw new RandomErrors('لقد حدث خطا أثناء البحث عن طلبكم 🥲\nيرجى المحاولة لاحقا 😘');
            }

            const data = res.data;
            const [ayatContent, surrahName, numberOfAyahs, type] = data.text ? 
                            [data.text, data.surah.name, data.surah.numberOfAyahs, data.surah.revelationType] : 
                            [data.ayahs.map(ayah => ayah.text), data.name, data.numberOfAyahs, data.revelationType]; 

            const avatar = msg.client.user.displayAvatarURL({ dynamic: true, size: 1024 });
            const informationEmbed = new EmbedBuilder()
                                         .setColor('DarkAqua')
                                         .setAuthor({ name: `${msg.client.user.username}`, iconURL: `${avatar}`})
                                         .setTitle(`${surrahName}`)
                                         .setDescription(
                                            `أياتها: \*\*${numberOfAyahs}\*\* .\nنوعها: \*\*${type}\*\*`
                                         );
            if(!Array.isArray(ayatContent)){
                await msg.channel.send({content: `${msg.author}`, embeds: [informationEmbed]});
                await msg.channel.send({content: `الأية الكريمة:\n${ayatContent}`});
                return;
            };                                

            let currentPage = 1;
            let curentLines = 0;
            const pagesNum = Math.ceil(ayatContent.length / 4);
            let body = poemDisplay(false, currentPage, curentLines, ayatContent, pagesNum, 4);
            const filter = (i) => i.user.id === msg.author.id;

            const row = new ActionRowBuilder().addComponents(buttons);
            const head = await msg.channel.send({content: `${msg.author}`, embeds: [informationEmbed]});
            const ReponseBody = await msg.channel.send({content: `${body.content}`});
            const footer = await msg.channel.send({ content: `صفحة ${body.currentPage} من ${pagesNum}`, components:[row] });
            const collector = footer.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, filter});

            collector.on('collect', async interaction =>{
                try {
                    await interaction.deferUpdate();
                    body = poemDisplay(interaction.customId, currentPage, curentLines, ayatContent, pagesNum, 4);
                    currentPage = body.currentPage;
                    curentLines = body.curentLines;

                    await ReponseBody.edit({content: `${body.content}`});
                    await footer.edit({ content: `صفحة ${body.currentPage} من ${pagesNum}`, components:[row] });
                    return;
                } catch (error) {
                    throw error;
                }
            });

            collector.on('end', async () =>{
                try {    
                    informationEmbed.setDescription('لقد إنتهى الوقت المحدد لهذه العملية ❌\nيرجى المحاولة مرة أخرى 😘').setColor('DarkGrey');
                    await head.edit({embeds: [informationEmbed]});
                    buttons.forEach(b => b.setDisabled(true));
                    await footer.edit({components:[row]});
                    return;
                } catch (error) {
                    throw new error;
                }
            });
            return;
        } catch (error) {
            await ErrorUnit.throwError(error, msg, 'حدث خطأ أثناء تنفيذ الأمر \`سورة\` 🥲');
            return;
        }
    }
}