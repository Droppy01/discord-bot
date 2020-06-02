
const Discord = require('discord.js');
const client = new Discord.Client();
const path = require('path');
const fs = require('fs');

var comands = [];

console.log("loading setings...")
let rawdata = fs.readFileSync('Settings.json');
let setings = JSON.parse(rawdata);

client.login(setings.token)

reloadModules(null)






client.on('ready', () => {
    console.log("active");
    client.user.setStatus('online')
    client.user.setActivity("nothing")
  });


  client.on('message', message => {
    var msg = message.content;
    if (msg.startsWith(setings.wakeUpCall)) {

        msg = msg.substring(setings.wakeUpCall.length)
        
        for (let topic of comands) {
            console.log()
            for (let comand of topic.comands) {
                if (msg.startsWith(comand.cmd)) {
                    if ((message.author.tag === setings.admin)||(comand.Permission === "serverOwner"&&message.member.hasPermission("ADMINISTRATOR")||(comand.Permission === "user"))){
                        comand.funcion(message);
                    }else {
                        console.log("unautherized")
                    }
                    
                    return;
                }
            }
        }
        
    }
  });
  function reloadModules(message) {
      if (message != null){
        message.channel.send("oke")
      }
    console.log("loding modules...")
    comands = 
    [
        {
            topic:"help",
            comands : 
            [ 
                {
                    name:"help",
                    Permission:"user",
                    cmd:"help",
                    funcion: help
                }
            ]
            
        },
        {
            topic:"settings",
            comands : 
            [ 
                {
                    Name:"user settings",
                    Permission:"user",
                    cmd:"settings",
                    funcion: (message) => {message.channel.send("comming soon")}
                },
                {
                    Name:"server settings",
                    Permission:"serverOwner",
                    cmd:"ServerSettings",
                    funcion: (message) => {message.channel.send("comming soon")}
                },
                {
                    Name:"reload modules",
                    Permission:"admin",
                    cmd:"reload",
                    funcion: reloadModules
                }
            ]
            
        }
        
    ]

    let dir = path.join(__dirname, "./modules")
    fs.readdir(dir,(err , files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach((file) => {
            let Module = require("./modules/"+file)
            let module = new Module();
            comands.push(module.metadata)
        })
    })
  }

  function help(message) {
    let HelpMsg = new Discord.MessageEmbed()
    .setTitle('list of all comands')
    .setColor("#232323")
      for (let topic of comands) {
        var msg = "";
        for (let comand of topic.comands){
            msg += comand.cmd+"\n"
        }
        HelpMsg.addField(topic.topic, msg, true)
      }
    message.channel.send(HelpMsg)  
  }
  

