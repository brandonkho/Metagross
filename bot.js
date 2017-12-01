var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

var queue = [];
var prefix = '!';
var timer;

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    
    
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'battle':
                queue.push(userID);
                if(queue.length == 2){
                    
                    bot.sendMessage({
                        to: channelID,
                        message: `<@${queue[0]}> and <@${queue[1]}> - time to battle!`
                    });
                    queue.splice(0, 2);
                    clearTimeout(timer);
                }else if(queue.length == 1){
                    bot.sendMessage({
                        to: channelID,
                        message: `You have been added to the queue`
                    });
                    timer = setTimeout(() => { clearQueue(channelID); }, 60*60*1000);
                }
                break;

            case 'quit':
                if(queue[0] == userID){
                    queue.splice(0);
                    clearTimeout(timer);
                    bot.sendMessage({
                        to: channelID,
                        message: `You have been removed from the queue`
                    });
                }
                
            break;
            // Just add any case commands if you want to..
         }
     }
});

function clearQueue(channelID){
    queue.splice(0);
    bot.sendMessage({
        to: channelID,
        message: `Too much time has passed. You have been removed from the queue`
    });
}