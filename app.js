const http = require('http');
const socketio = require('socket.io');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8555"));

const server = http.createServer((req, res) => {
    res.end('Server is running...');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const io = socketio(server, {
    cors: {
        origin: '*',
        methods: 'GET',
    }
});

io.on('connection', (socket) => {
    let imzalanacakveri = "Merhaba lütfe bu (" + socket.id + ") veriyi imzalayın";

    socket.on('login', (data) => {
        let frontEndAddress = data.address;
        socket.emit('imzaAt', {
            veri: imzalanacakveri
        });
    });

    socket.on('imzaladim', (data) => {
        let cozumlenmisimza = web3.eth.accounts.recover(imzalanacakveri, data.imza)

        if (data.address.toLowerCase() == cozumlenmisimza.toLowerCase()) {
            socket.emit('imzaCozum', {
                success: true
            });
        } else {
            socket.emit('imzaCozum', {
                success: false
            });
        }

    });


});