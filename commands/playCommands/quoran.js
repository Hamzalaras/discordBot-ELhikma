const { EmbedBuilder, ComponentType } = require('discord.js');
const quoran = require('../../data/quoran.json');
const { footer } = require('../../centralUnits/footer.js');
const { poemDisplay } = require('../../centralUnits/textDisplay.js');
const { fetching } = require('../../centralUnits/fetching.js');
const { ErrorUnit, CollectorError } = require('../../centralUnits/errorUnit.js');

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
            if(!surrahNum || surrahNum > 114 || surrahNum < 1){
                await msg.channel.send({content: `${msg.author}\nيرجى استخدام الأمر \`\`سورة\`\` بالشكل الصحيح  ❤️`});
                return;
            }   
  
            const url = !isNaN(ayah) ? 
                        `http://api.alquran.cloud/v1/ayah/${surrahNum}:${ayah}` : 
                        `http://api.alquran.cloud/v1/surah/${surrahNum}` ;

            const res = await fetching(url);            
            if(res.status === 'NOT FOUND'){
                await msg.channel.send({content: `${msg.author} \n يرجى ادخال معلومات صحيحة!! ❤️`});
                return;
            }else if(res.status !== 'OK'){
                await msg.channel.send({content: `${msg.author} \n لقد حدث خطا أثناء البحث عن طلبكم 🥲\nيرجى المحاولة لاحقا ❤️`});
                return;
            }

            const data = res.data;
            const [ayatContent, surrahName, numberOfAyahs, type] = data.text ? 
                            [data.text, data.surah.name, data.surah.numberOfAyahs, data.surah.revelationType] : 
                            [data.ayahs.map(ayah => ayah.text), data.name, data.numberOfAyahs, data.revelationType]; 
            
            const informationEmbed = new EmbedBuilder()
                                         .setTitle(`${surrahName}`)
                                         .setDescription(
                                            `\*\*أياتها\*\*: ${numberOfAyahs}\n \*\*نوعها\*\*: ${type}`
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
            const head = await msg.channel.send({content: `${msg.author}`, embeds: [informationEmbed]});
            const ReponseBody = await msg.channel.send({content: `${body.content}`});
            const buttons = await msg.channel.send({ content: `صفحة ${body.currentPage} من ${pagesNum}`, components:[footer] });
            const collector = buttons.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, filter});

            collector.on('collect', async interaction =>{
                try {
                    await interaction.deferUpdate();
                    body = poemDisplay(interaction.customId, currentPage, curentLines, ayatContent, pagesNum, 4);
                    currentPage = body.currentPage;
                    curentLines = body.curentLines;

                    await ReponseBody.edit({content: `${body.content}`});
                    await buttons.edit({ content: `صفحة ${body.currentPage} من ${pagesNum}`, components:[footer] });
                    return;
                } catch (error) {
                    throw new CollectorError(error.message);
                }
            });

            collector.on('end', async () =>{
                try {    
                    await head.edit({content: `${msg.author} \nلقد إنتهى الوقت المحدد❌\nيرجى المحاولة لاحقا ❤️`});
                    return;
                } catch (error) {
                    throw new CollectorError(error.message);
                }
            });
                            

        } catch (error) {
            await ErrorUnit(error, msg, 'حدث خطأ أثناء تنفيذ الأمر سورة');
            return;
        }
    }
}