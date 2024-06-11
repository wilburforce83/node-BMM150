const BMM150 = require('./index');
const cliProgress = require('cli-progress');


(async () => {
    try {
        const bmm150 = new BMM150(1, 0x13); // Specify the I2C bus and address
        await bmm150.initialize();
        console.log('BMM150 initialized successfully');

        // Setup sensor configuration
        bmm150.setOperationMode(BMM150.OP_MODE_NORMAL);
        bmm150.setPresetMode(BMM150.PRESETMODE_HIGHACCURACY);
        bmm150.setRate(BMM150.RATE_10HZ);
        bmm150.setMeasurementXYZ();

        // Get raw data
        const rawData = bmm150.readMagnetometerData();
        console.log(`Raw Magnetometer Data: X=${rawData.x}, Y=${rawData.y}, Z=${rawData.z}`);

        // Get geomagnetic data
        const geomagneticData = bmm150.getGeomagnetic();
        console.log(geomagneticData);
        console.log(`Geomagnetic Data: X=${geomagneticData.x} µT, Y=${geomagneticData.y} µT, Z=${geomagneticData.z} µT`);

        // Get compass degree
        const compassDegree = bmm150.getCompassDegree();
        console.log(`Compass Degree: ${compassDegree.toFixed(2)}°`);

        // Stream live data
       // bmm150.streamLiveData(100); // Stream data at 10 Hz (100ms interval)

        // Stop streaming after 10 seconds (example)
       // setTimeout(() => bmm150.stopStream(), 10000);
    } catch (error) {
        console.error('Error initializing BMM150:', error);
    }
})();
