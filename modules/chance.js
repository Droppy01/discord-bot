class Module {
    
    metadata = 
    {
    topic : "chance",
    comands : 
        [ 
            {
                name: "coinFlip",
                Permission:"user",
                cmd:"flip",
                funcion: this.flip
            }
        ]
    }

    flip(message) {
        let random = Math.random();
        if (random < 0.45) {
            message.channel.send("tails");
        } else if (random < 0.9) {
            message.channel.send("heads");
        } else {
            message.channel.send("invalit");
        }
    }
 }

 module.exports = Module