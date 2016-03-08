var request = require('request');
var url = require('url');


var sourceSelections = [
	'Cable Sat', 'Disc', 'Server', 'AUX', 'Game', 'STB',
    'Audio', 'iPod', 'AM', 'Home Network', 'vTuner'
];

var commands = [
    'volume-down', 'mute-toggle', 'previous', 'pause',
    'tune-down', 'play', 'tune-up', 'source-selection'
];

var HK = function(options) {
	this.url  = url.parse(options['url']);
    this.port = 10025;
    this.descriptionPort = 8080;

    this.commandUrl = this.url.protocol + "//" + this.url.host + ":" + this.port;
    this.descriptionUrl = this.url.protocol + "//" + this.url.host + ":" + this.descriptionPort;
};

HK.prototype.commandBody = function(cmd, param) {
	return "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <harman> <avr> <common> <control> <name>" + cmd + "</name> <zone>Main Zone</zone> <para>"+ param +"</para> </control> </common> </avr> </harman>";
};

HK.prototype.postRequest = function(cmd, param, callback) {
    request({
        url: this.commandUrl,
        body: this.commandBody(cmd, param),
        method: "POST",
        timeout: 300,
        headers: {
            'Content-Type': 'text/xml'
        }

    }, function(error, response, body) {
        if (callback) callback(error, response, body);
    });
};

HK.prototype.powerState = function(callback) {
    request({
        url: this.descriptionUrl,
        method: "GET",
        timeout: 300,
        headers: {
            'Content-Type': 'text/xml'
        }

    }, function(error, response, body) {
        if (callback) callback(response.statusCode == 200);
    });
};

HK.prototype.selectSource = function(sourceName) {
    return this.postRequest('source-selection', sourceName);
};

HK.prototype.runCommand = function(cmd, param, callback) {
    return this.postRequest(cmd, param, callback);
};

module.exports = HK;