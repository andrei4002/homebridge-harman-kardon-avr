var Service, Characteristic;
var HK = require('./lib/hk');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-harman-kardon', 'HarmanKardonAVR', HarmanKardonAVRAccessory);
};

function HarmanKardonAVRAccessory(log, config) {
    this.log = log;
    this.config = config;
    this.ip = config['ip'];
	this.port = config['port'];
    this.name = config['name'];

    this.defaultInput = config['defaultInput'] || 'TV';

    this.hk = new HK(this.ip, this.port);

    this.service = new Service.Switch('Power');
}

HarmanKardonAVRAccessory.prototype.getPowerState = function (callback) {
    this.hk.getPowerState(function (err, state) {
        if (err) {
            this.log(err);
            callback(err);
        } else
            this.log('current power state is: %s', (state) ? 'ON' : 'OFF');
        callback(null, state);
    }.bind(this));
};

HarmanKardonAVRAccessory.prototype.setPowerState = function (powerState, callback) {
    if (powerState && this.defaultInput) {
        this.hk.setInput(this.defaultInput, function (err) {
            if (err) {
                this.log('Error setting default input');
                callback(err);
            }
        }.bind(this));
    } else {
        this.hk.setPowerState(powerState, function (err, state) {
            if (err) {
                this.log(err);
                callback(err);
            } else {
                this.log('hk avr powered %s', state);
            }
        }.bind(this));
    }

    if (powerState && this.defaultVolume) {
        setTimeout(function() {
            this.hk.setVolume(this.defaultVolume, function (err) {
                if (err) {
                    this.log('Error setting default volume');
                    callback(err);
                }
            }.bind(this));
        }.bind(this), 4000);
    }

    callback(null);
};

HarmanKardonAVRAccessory.prototype.getServices = function () {
    var informationService = new Service.AccessoryInformation();

    informationService
        .setCharacteristic(Characteristic.Name, this.name)
        .setCharacteristic(Characteristic.Manufacturer, this.type)
        .setCharacteristic(Characteristic.Model, this.name)
        .setCharacteristic(Characteristic.SerialNumber, 'unknown');

    this.service.getCharacteristic(Characteristic.On)
        .on('get', this.getPowerState.bind(this))
        .on('set', this.setPowerState.bind(this));

    return [informationService, this.service];
};