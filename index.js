const i2c = require('i2c-bus');

class BMM150 {
    constructor(busNumber = 1, address = 0x13) {
        this.i2cBus = i2c.openSync(busNumber);
        this.address = address;
    }

    writeRegister(register, value) {
      //  console.log(`Writing to register 0x${register.toString(16)}: 0x${value.toString(16)}`);
        this.i2cBus.writeByteSync(this.address, register, value);
    }

    readRegister(register, length = 1) {
        const buffer = Buffer.alloc(length);
        this.i2cBus.readI2cBlockSync(this.address, register, length, buffer);
        return buffer;
    }

    setPower(enabled) {
        const powerState = enabled ? BMM150.POWER_ON : BMM150.POWER_OFF;
        this.writeRegister(BMM150.POWER_CTRL, powerState);
       // console.log(`Power ${enabled ? 'enabled' : 'disabled'}`);
    }

    setOperationMode(mode) {
        this.writeRegister(BMM150.OP_MODE, mode);
       // console.log(`Operation mode set to 0x${mode.toString(16)}`);
    }

    getChipID() {
        const chipId = this.readRegister(BMM150.CHIP_ID, 1)[0];
       // console.log(`Read chip ID: 0x${chipId.toString(16)}`);
        return chipId;
    }

    async initialize() {
        this.setPower(true);
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

        const chipId = this.getChipID();
        if (chipId !== BMM150.CHIP_ID_VALUE) {
            throw new Error(`Unexpected chip ID: 0x${chipId.toString(16)}`);
        }

        this.setOperationMode(BMM150.OP_MODE_NORMAL);
    }

    readMagnetometerData() {
        const xLsb = this.readRegister(BMM150.DATA_X_LSB, 1)[0];
        const xMsb = this.readRegister(BMM150.DATA_X_MSB, 1)[0];
        const yLsb = this.readRegister(BMM150.DATA_Y_LSB, 1)[0];
        const yMsb = this.readRegister(BMM150.DATA_Y_MSB, 1)[0];
        const zLsb = this.readRegister(BMM150.DATA_Z_LSB, 1)[0];
        const zMsb = this.readRegister(BMM150.DATA_Z_MSB, 1)[0];

        const x = (xMsb << 8) | xLsb;
        const y = (yMsb << 8) | yLsb;
        const z = (zMsb << 8) | zLsb;
        const time = new Date().toISOString()

        return { x, y, z, time };
    }

    // New methods based on Python script
    setPresetMode(mode) {
        this.writeRegister(BMM150.PRESET_MODE, mode);
      //  console.log(`Preset mode set to 0x${mode.toString(16)}`);
    }

    setRate(rate) {
        this.writeRegister(BMM150.MODE_RATE_REGISTER, rate);
      //  console.log(`Rate set to 0x${rate.toString(16)}`);
    }

    setMeasurementXYZ() {
        this.writeRegister(BMM150.REG_AXES_ENABLE, 0x00);
      //  console.log(`Measurement XYZ enabled`);
    }

    getGeomagnetic() {
        const data = this.readMagnetometerData();
        return {
            x: data.x / 16, // Convert to microteslas
            y: data.y / 16,
            z: data.z / 16,
            time: new Date().toISOString()
        };
    }

    getCompassDegree() {
        const geomagnetic = this.getGeomagnetic();
        const degree = Math.atan2(geomagnetic.y, geomagnetic.x) * 180 / Math.PI;
        return degree >= 0 ? degree : degree + 360;
    }

    async streamLiveData(rate = 100) {
        console.log(`Starting live data stream with rate: ${rate}ms`);
        this.streamInterval = setInterval(() => {
            try {
                const geomagnetic = this.getGeomagnetic();
                const degree = this.getCompassDegree();
                console.log(`Magnetometer data: X=${geomagnetic.x} µT, Y=${geomagnetic.y} µT, Z=${geomagnetic.z} µT`);
                console.log(`Compass degree: ${degree.toFixed(2)}°`);
            } catch (error) {
                console.error('Error reading geomagnetic data:', error);
            }
        }, rate);
    }

    stopStream() {
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
            console.log('Stopped live data stream');
        }
    }
}

// Register addresses and constants
BMM150.CHIP_ID = 0x40;
BMM150.POWER_CTRL = 0x4B;
BMM150.OP_MODE = 0x4C;
BMM150.DATA_X_LSB = 0x42;
BMM150.DATA_X_MSB = 0x43;
BMM150.DATA_Y_LSB = 0x44;
BMM150.DATA_Y_MSB = 0x45;
BMM150.DATA_Z_LSB = 0x46;
BMM150.DATA_Z_MSB = 0x47;
BMM150.MODE_RATE_REGISTER = 0x4C;
BMM150.REG_AXES_ENABLE = 0x4E;
BMM150.PRESET_MODE = 0x4E;

BMM150.CHIP_ID_VALUE = 0x32;
BMM150.POWER_ON = 0x01;
BMM150.POWER_OFF = 0x00;
BMM150.OP_MODE_NORMAL = 0x00;
BMM150.OP_MODE_SLEEP = 0x03;
BMM150.PRESETMODE_HIGHACCURACY = 0x03;
BMM150.RATE_10HZ = 0x00;

// Exporting the BMM150 class
module.exports = BMM150;

