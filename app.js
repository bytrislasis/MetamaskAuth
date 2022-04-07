const http = require('http');
const socketio = require('socket.io');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8555'));

const server   = http.createServer((req,res)=>{
    res.end("Server is running....");
});

server.listen(3000,()=>{
    console.log("Server is running on port 3000");
});


const io = socketio(server,{
    cors:{
        origin:'*',
        methods:['GET'],
    }
});


io.on('connection',(socket)=>{
    let imzalancakVeri = "Hoş geldiniz lüfen bu veriyi imzalayın : " + socket.id;


    socket.on('auth',(data)=>{

        socket.emit('imzala',{
            message:imzalancakVeri
        });
    });

    socket.on('imzalandi',(data)=>{

        console.log(data.address);
        console.log(data.imza);

        let veri = web3.eth.accounts.recover(imzalancakVeri,data.imza);
        if(veri.toLowerCase() == data.address.toLowerCase()){
            socket.emit('login',{success:true});
        }else{
            console.log("Imza yanlış");
        }



    });



});