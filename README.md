# node-BMM150
Node JS package for the BMM150 magnetometer unit using I2C



### `BMM150` Class Documentation

#### Constructor

```javascript
constructor(busNumber = 1, address = 0x13)
```
- `busNumber`: The I2C bus number (default is 1).
- `address`: The I2C address of the BMM150 sensor (default is 0x13).

#### Methods

##### `initialize()`

Initializes the sensor by setting the power on, reading the chip ID, and setting the operation mode to normal.

```javascript
async initialize()
```

##### `setPower(enabled)`

Enables or disables the power.

```javascript
setPower(enabled)
```
- `enabled`: `true` to enable power, `false` to disable power.

##### `setOperationMode(mode)`

Sets the operation mode of the sensor.

```javascript
setOperationMode(mode)
```
- `mode`: Operation mode (e.g., `BMM150.OP_MODE_NORMAL`).

##### `setPresetMode(mode)`

Sets the preset mode for the sensor.

```javascript
setPresetMode(mode)
```
- `mode`: Preset mode (e.g., `BMM150.PRESETMODE_HIGHACCURACY`).

##### `setRate(rate)`

Sets the data rate for the sensor.

```javascript
setRate(rate)
```
- `rate`: Data rate (e.g., `BMM150.RATE_10HZ`).

##### `setMeasurementXYZ()`

Enables measurement on the X, Y, and Z axes.

```javascript
setMeasurementXYZ()
```

##### `readMagnetometerData()`

Reads the raw magnetometer data from the sensor.

```javascript
readMagnetometerData()
```
- Returns an object with `x`, `y`, and `z` properties representing the raw data.

##### `getGeomagnetic()`

Gets the compensated geomagnetic data.

```javascript
getGeomagnetic()
```
- Returns an object with `x`, `y`, and `z` properties in microteslas (µT).

##### `getCompassDegree()`

Gets the compass degree based on geomagnetic data.

```javascript
getCompassDegree()
```
- Returns the degree value indicating the angle between the pointing direction and north.

##### `streamLiveData(rate)`

Streams live data from the sensor at the specified rate.

```javascript
async streamLiveData(rate = 100)
```
- `rate`: The interval rate in milliseconds (default is 100ms).

##### `stopStream()`

Stops the live data stream.

```javascript
stopStream()
```

### Example Usage

Here’s how to use the different methods to get raw data, geomagnetic data, and compass degree.

#### Example Script

```javascript
const BMM150 = require('./path/to/bmm150');

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
        console.log(`Geomagnetic Data: X=${geomagneticData.x} µT, Y=${geomagneticData.y} µT, Z=${geomagneticData.z} µT`);

        // Get compass degree
        const compassDegree = bmm150.getCompassDegree();
        console.log(`Compass Degree: ${compassDegree.toFixed(2)}°`);

        // Stream live data
        bmm150.streamLiveData(100); // Stream data at 10 Hz (100ms interval)

        // Stop streaming after 10 seconds (example)
        setTimeout(() => bmm150.stopStream(), 10000);
    } catch (error) {
        console.error('Error initializing BMM150:', error);
    }
})();
```

### Explanation

1. **Initialization**:
   - Initialize the sensor using `await bmm150.initialize()`.

2. **Setup Configuration**:
   - Set the sensor to normal operation mode, high accuracy preset mode, and 10 Hz data rate.
   - Enable measurement on the X, Y, and Z axes.

3. **Get Raw Data**:
   - Use `readMagnetometerData()` to get the raw magnetometer data.

4. **Get Geomagnetic Data**:
   - Use `getGeomagnetic()` to get the compensated geomagnetic data in microteslas (µT).

5. **Get Compass Degree**:
   - Use `getCompassDegree()` to get the compass degree.

6. **Stream Live Data**:
   - Use `streamLiveData(rate)` to start streaming live data at the specified rate.
   - Use `stopStream()` to stop streaming data.

By following this documentation and example usage, you can easily integrate the BMM150 sensor into your Node.js applications and retrieve different types of data as needed.
