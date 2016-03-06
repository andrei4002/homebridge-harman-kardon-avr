var http = require('http');

var sourceSelections = [
	'Cable Sat',
	'Disc',
	'Server',
	'AUX',
	'Game',
	'STB',
	'Audio',
	'iPod',
	'AM',
	'Home Network',
	'vTuner'
]

var commands = [
    'volume-down',
    'mute-toggle',
    'previous',
    'pause',
    'tune-down',
    'play',
    'tune-up',
    'source-selection'
]

var HK = function(options) {
	this.host  = options['host'];
	this.port  = options['port'];
}

HK.prototype.commandBody = function(cmd, param) {
	return "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <harman> <avr> <common> <control> <name>" + cmd + "</name> <zone>Main Zone</zone> <para>"+ param +"</para> </control> </common> </avr> </harman>";
}

HK.prototype.postRequest = function(cmd, param, callback) {
	var body = this.commandBody(cmd, param);
	
	var postRequest = {
	    host: this.host,
	    path: "/",
	    port: this.port,
	    method: "POST",
	    headers: {
	        'Content-Type': 'text/xml',
	        'Content-Length': Buffer.byteLength(body)
        }
    };
	
    var req = http.request( postRequest, function( res )    {
        console.log( res.statusCode );
    });

    req.on('error', function(e) {
        //console.log('problem with request: ' + e.message);
		callback();
    });

    req.on('socket', function (socket) {
        socket.setTimeout(300);
        socket.on('timeout', function() {
			console.log("timeout ba");
            req.abort();
        });
    });

	req.write( body );
	req.end();
}

HK.prototype.powerState = function(callback) {
	var getRequest = {
	    host: this.host,
	    path: "/",
	    port: 8080,
	    method: "GET",
	    headers: {
	        'Content-Type': 'text/xml',
	        'Content-Length': Buffer.byteLength('')
        }
    };
	
    var req = http.request( getRequest, function( res )    {
		callback(res.statusCode == 200);
    });
	
    req.on('socket', function (socket) {
        socket.setTimeout(2000);
        socket.on('timeout', function() {
            req.abort();
        });
    });
	
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
		callback(false);
    });
	
	req.write('');
	req.end();
}

HK.prototype.selectSource = function(sourceName) {
    return this.postRequest('source-selection', sourceName);
}

HK.prototype.runCommand = function(cmd, param, callback) {
    return this.postRequest(cmd, param, callback);
}

module.exports = HK;