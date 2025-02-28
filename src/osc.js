const { Client } = require('osc');

const client = new Client('127.0.0.1', 12345); // Ajusta el puerto según necesites

function sendOSCMessage(address, message) {
    try {
        client.send(address, message);
        console.log(`OSC message sent: ${address} - ${message}`);
    } catch (error) {
        console.error('Error sending OSC message:', error);
    }
}

module.exports = { sendOSCMessage };