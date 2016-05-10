'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

var x = [];
x[0] = "Trying to be adventurous eh? I'm only good at structured conversations. Ask for hints on how to trick me. Or maybe we can chit chat about \'Bali\' or in general?";
x[1] = "I am not sure I understand. Please try again. Still trying to learn about emojis and decipher full sentences.";
x[2] = "Sorry did not understand you. Can you try again? Ask for more hints if you're not able to trick me!";
x[3] = "Din't get you! Like I said, I'm only good at structured conversations. Ask for hints on how to trick me. Or maybe we can talk about who I am?";
x[4] = "Say what?";
x[5] = "No, doesn't work like that. Do you want to hear a joke instead? Ask me then!";

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = new Script({
    processing: {
        prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('This is Alien bot. Tip to converse with me - Type phrases instead of full sentences.\n\n Begin by typing ALIEN')
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
					var y = Math.floor(Math.random() * 6)
					return bot.say(x[y]).then(() => 'speak');
                    //return bot.say('Trying to be adventurous eh? I\'m only good at structured conversations. Ask for hints on how to trick me. Or maybe we can chit chat about \'Bali\' or in general?').then(() => 'speak');
                }

                var response = scriptRules[upperText];
				
                var lines = response.split('\n\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return wait(50).then(function() {
                            return bot.say(line);
                        });
                    });
                });

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
