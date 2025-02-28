const osc = require('osc');
const dgram = require('dgram');

const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121,
    remoteAddress: "127.0.0.1",
    remotePort: 12345
});

// Initialize UDP port
udpPort.open();

udpPort.on("ready", () => {
    console.log("OSC UDP port ready");
});

function sendOSCMessage(address, message) {
    try {
        udpPort.send({
            address: address,
            args: [
                {
                    type: "s",
                    value: typeof message === 'string' ? message : JSON.stringify(message)
                }
            ]
        });
        console.log(`OSC message sent: ${address} - ${message}`);
    } catch (error) {
        console.error('Error sending OSC message:', error);
        throw error;
    }
}

module.exports = { sendOSCMessage };