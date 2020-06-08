
const Discord = require('discord.js');
const client = new Discord.Client();
const path = require('path');
const fs = require('fs');
let NumberOfModules = 0;
var comands = [];

console.log("loading setings...")
let settings = {wakeUpCall:"bt!",
token:"place your token here",
admin:"put your id here"}
if (fs.existsSync('Settings.json')){
let rawdata = fs.readFileSync('Settings.json');
setings = JSON.parse(rawdata);
} else {
    fs.writeFileSync('Settings.json',"{\n   \"wakeUpCall\":\"bt!\",\n   \"token\":\"\",\n   \"admin\":\"put your username here\"\n}")
    return
}

client.login(setings.token)

reloadModules(null)





client.on('ready', () => {
    console.log("active");
    client.user.setStatus('online')
    client.user.setActivity("with "+NumberOfModules+" modules")
  });

  client.on('message', message => {
    var msg = message.content;
    if (msg.startsWith(setings.wakeUpCall)) {

        msg = msg.substring(setings.wakeUpCall.length)
        
        for (let topic of comands) {
            for (let comand of topic.comands) {
                if (msg.startsWith(comand.cmd)) {
                    if ((message.author.tag === setings.admin)||(comand.Permission === "serverOwner"&&message.member.hasPermission("ADMINISTRATOR")||(comand.Permission === "user"))){
                        comand.funcion(message);
                    }else {
                        message.channel.send("unautherized")
                    }
                    
                    return;
                }
            }
        }
        
    }
  });
  function reloadModules(message) {
      if (message != null){
        message.channel.send("oke");
      }
    console.log("loding modules...")
    comands = 
    [
        {
            topic:"help",
            author: {
                name:"droppy01",
                img:"https://avatars0.githubusercontent.com/u/56587763?s=460&v=4",
                url:"https://github.com/Droppy01"
            },
            comands : 
            [ 
                {
                    name:"list",
                    Permission:"user",
                    cmd:"ls",
                    funcion: list
                },
                {
                    Name:"manual",
                    Permission:"user",
                    cmd:"man",
                    funcion: man,
                    
                    manual:{
                        use: "[comand]",
                        discription:"this comand shows the manual of other comands",
                        footer:"08-06-2020"
                    }
                }
            ]
            
        },
        {
            topic:"settings",
            Permission:"serverOwner",
            author: {
                name:"droppy01",
                img:"https://avatars0.githubusercontent.com/u/56587763?s=460&v=4",
                url:"https://github.com/Droppy01"
            },
            comands : 
            [ 
                {
                    Name:"server settings",
                    Permission:"serverOwner",
                    cmd:"Settings",
                    funcion: (message) => {message.channel.send("comming soon")}
                },
                {
                    Name:"reload modules",
                    Permission:"admin",
                    cmd:"reload",
                    funcion: reloadModules,
                    manual:{
                        discription:"this comand reloads all modules",
                        footer:"this is a footer"
                    }
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
            NumberOfModules++;
            let Module = require("./modules/"+file);
            let module = new Module();
            comands.push(module.metadata);
        })
    })
  }

  function list(message) {
    let listMsg = new Discord.MessageEmbed()
    .setTitle('list of all comands')
    .setColor("#232323")
      for (let topic of comands) {
        var msg = "";
        for (let comand of topic.comands){
            msg += comand.cmd+"\n"
        }
        listMsg.addField(topic.topic, msg, true)
      }
    message.channel.send(listMsg)  
  }

  function man(message) {
      let msg = message.content.substring(7)
    for (let topic of comands) {
        for (let comand of topic.comands) {
            if (msg.startsWith(comand.cmd)) {
                if ((message.author.tag === setings.admin)||(comand.Permission === "serverOwner"&&message.member.hasPermission("ADMINISTRATOR")||(comand.Permission === "user"))){
                    if (comand.manual) {
                        let manualEmbed = new Discord.MessageEmbed()
                        .setColor("#23232")
                        .setTitle(comand.Name)
                        .setDescription(topic.topic)
                        
                        if (comand.author) {
                            console.log("test")
                            if (typeof(comand.author) == "object") {
                                manualEmbed.setAuthor(comand.author.name ,comand.author.img, comand.author.url)
                            } else if (typeof(comand.author) == "String") {
                                console.log("test")
                                manualEmbed.setAuthor(comand.author)
                            }
                        } else if (topic.author) {
                            if (typeof(topic.author) == "object") {
                                manualEmbed.setAuthor(topic.author.name ,topic.author.img, topic.author.url)
                            } else if (typeof(topic.author) == "string") {
                                console.log(topic.author)
                                manualEmbed.setAuthor(topic.author)
                            }
                            
                        }

                        if (typeof(comand.manual) == "string"){
                            manualEmbed.addFields(
                                [
                                    {name:'comand use', value: setings.wakeUpCall+comand.cmd},
                                    {name:'comand discription', value: comand.discription }
                                ])
                        }else  if (typeof(comand.manual) == "object") {
                            if (comand.manual.use){
                                manualEmbed.addField('comand use', setings.wakeUpCall+comand.cmd+ " "+comand.manual.use)
                            }else {
                                manualEmbed.addField('comand use', setings.wakeUpCall+comand.cmd)
                            }
                            if (comand.manual.discription){
                                manualEmbed.addField('comand discription', comand.manual.discription)
                            }
                            if (comand.manual.footer){
                                manualEmbed.setFooter(comand.manual.footer)
                            }
                        }

                        message.channel.send(manualEmbed)


                    }else {
                        message.channel.send("comand "+msg+" has no manual")
                    }
                }else {
                    message.channel.send("unautherized")
                }
                
                return;
            }
        }
        
    }
    message.channel.send("could not find a comand\ntype \""+setings.wakeUpCall+"ls\" for a list of the comands")
  }
  

