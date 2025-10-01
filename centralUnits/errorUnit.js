const { BaseInteraction } = require('discord.js');

//Customization the Errors name s and shit...
class BotError extends Error{
    constructor(message){
        super(message);
        this.name = this.constructor.name;
    }
}

//Some possible Errors 
class DatabaseError extends BotError{};
class FetchingError extends BotError{};
class ScarpingError extends BotError{};

// This is for all the other cases where Errors r not really Errors 
class FalseInput extends BotError{};
class RandomErrors extends BotError{}; 

class ErrorUnit{
    static async throwError(err, msg, errMsg = `يبدو أن هناك خطأ ما`){
        let response = '';
        try {
            //Select the switable response for each Error that can accure
            switch (err.name){
                case 'DatabaseError':
                    response = 'حدث خطأ اثناء الإتصال بقاعدة البيانات 🥲';
                    break;
                case 'FetchingError':
                    response = 'حدث خطأ اثناء الإتصال ب: API 🥲';
                    break;
                case 'ScarpingError':
                    response = 'حدث خطأ اثناء جلب البيانات 🥲';
                    break;

                //Since this Errors r not really Errors there message property will be customize According to there role in code
                case 'FalseInput':
                    response = `يرجى استخدام الأمر \`${err.message}\` بالشكل الصحيح!!\nإطبع الأمر \`مساعدة\` \`${err.message}\` للشرح. 😘`;
                    break;  
                case 'RandomErrors':
                    response = err.message;
                    break;     
                //If a new Error type accure in code                
                default:
                    response = errMsg;
            }

            //Detecting if the -msg- object is an interaction base or a message base, so i can use the switable way to response
            const responseObj = msg instanceof BaseInteraction ? 
                                    await msg.editReply(`${msg.user}\n${response}`):
                                    await msg.channel.send(`${msg.author}\n${response}`);
    
            //Planing to add an dashBoard soon!!                        
            console.error(err);      
            //Deleting the Error message so there is no accumulation in discord channels
            deleteError(responseObj, msg);
            return;

        } catch (error) {
            console.error(err);
        }
    }
}

//Delete the messages 
function deleteError(obj, msg){
    setTimeout(()=>{
        obj.delete().catch(async err => {
            await ErrorUnit.throwError(err, msg, 'حدث خطأ أثناء محاولة حذف رسالة الخطأ 🥲');
        })
    }, 4_000)
}

module.exports = { DatabaseError, FetchingError, ScarpingError, FalseInput, RandomErrors, ErrorUnit };
