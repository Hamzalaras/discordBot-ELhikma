const { EmbedBuilder,  ComponentType} = require('discord.js');
const poetes = require('../../data/poetes.json');
const { footer } = require('../../centralUnits/footer.js');
const { random } = require('../../centralUnits/randomItem.js');
const { poemDisplay } = require('../../centralUnits/textDisplay.js');
const { poemScarping } = require('../../scarping/poem.js');
const { ErrorUnit } = require('../../centralUnits/errorUnit.js');

module.exports = {
    name: ['أبيات', 'ابيات', 'قصيدة', 'قصيده', 'شعر'],
    async execute(msg, args){
        const thinking = await msg.channel.send(`يتم البحث عن القصيدة يرجى الانتظار... 🤔`);
        try {
            const [poetOrCountry , poemId] = [args[1], args[2]];

            let targetPoet = poetOrCountry ?
                               isNaN(poetOrCountry)  ?
                               poetes.find(poet => poet.name.includes(poetOrCountry)) ?? getCountry() : 
                               poetes.find(poet => poetOrCountry === poet.id) : 
                               false ;

            function getCountry(){
                const targetCountryPoets = [];
                poetes.forEach(poet =>{
                    if(poet.country.includes(poetOrCountry)) targetCountryPoets.push(parseInt(poet.id));
                });
                if(targetCountryPoets.length === 0) return undefined;
                const randomPoet = poetes[targetCountryPoets[Math.floor(Math.random() * targetCountryPoets.length)]];
                return randomPoet;
            }

            if(targetPoet === undefined){
                await thinking.edit({content: `${msg.author} \n لم يتم العثور على طلبكم: ~${poetOrCountry}~ 🥲`});
                return;
            }else if(!targetPoet){
                targetPoet = random(poetes);
            }
            
            const data = targetPoet.data;
            const poem = isNaN(poemId) ? 
                         random(data) :
                         data[poemId];
            if(!poem){
                await thinking.edit({content: `${msg.author} \n لم يتم العثور على طلبكم: ~${poemId}~ 🥲`});
                return;
            }            
            const informationEmbed = new EmbedBuilder()
                                        .setColor('DarkAqua')
                                        .setTitle(poem.title)
                                        .setDescription(`✍️قصيدة للشاعر:  ${targetPoet.name[0]}.\n 🌊من بحر: ${poem.sea}. 📝عدد ابياتها: ${poem.lines}. 💭ذات معنى: ${poem.tags} \n معرف الشاعر: ${targetPoet.id}.\n معرف القصيدة: ${poem.id}.`);

            const poemLines = await poemScarping(poem.url, msg);
            const pagesNum = Math.ceil(poemLines.length / 6);

            let currentPage = 1;
            let curentLines = 0;

            let body = poemDisplay(false, currentPage, curentLines, poemLines, pagesNum, 6);
            const filter = (i) => i.user.id === msg.author.id;
            await thinking.edit({content: `${msg.author}`, embeds: [informationEmbed]});
            const ReponseBody = await msg.channel.send({content: `${body.content}`});
            const buttons = await msg.channel.send({ content: `صفحة ${body.currentPage} من ${pagesNum}`, components:[footer] });
            const collector = buttons.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, filter});

            collector.on('collect', async interaction =>{
                await interaction.deferUpdate();
                body = poemDisplay(interaction.customId, currentPage, curentLines, poemLines, pagesNum, 6);
                currentPage = body.currentPage;
                curentLines = body.curentLines;

                await ReponseBody.edit({content: `${body.content}`});
                await buttons.edit({ content: `صفحة ${body.currentPage} من ${pagesNum}`, components:[footer] });
            });

            collector.on('end', async () =>{
                await thinking.edit({content: `${msg.author} \nلقد إنتهى الوقت المحدد❌\nيرجى المحاولة لاحقا ❤️`, embeds: []});
                await buttons.delete();
                await ReponseBody.delete();
                return;
            });

            
        } catch (error) {
            await thinking.delete();
            await ErrorUnit.throwError(error, msg, 'حدث خطأ أثناء تنفيذ الأمر أبيات');
            return;
        }
    }
}