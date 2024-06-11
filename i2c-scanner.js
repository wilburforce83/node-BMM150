const i2c = require('i2c-bus');

const i2cBus = i2c.openSync(1);

console.log('Scanning I2C bus...');
for (let addr = 0x03; addr <= 0x77; addr++) {
    try {
        i2cBus.readByteSync(addr, 0x00);
        console.log(`Found device at address 0x${addr.toString(16)}`);
    } catch (e) {
        if (e.message.includes('Remote I/O error')) {
            // Device not present at this address
        } else {
            console.error(`Error accessing 0x${addr.toString(16)}: ${e.message}`);
        }
    }
}

i2cBus.closeSync();
