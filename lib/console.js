var HK = require('./hk');

var argv = require('minimist')(process.argv.slice(2));

if (!argv.cmd){
	console.log("\nusage: \n node index.js --host=your-host(optional, default is 192.168.1.184) --port=your-port(optional, default is 10025) --cmd=your-cmd --param=your-param(optional, default is blank)\n");
	process.exit(1);
}

if (!argv.host) argv.host = "192.168.1.184";
if (!argv.port) argv.port = 10025;
if (!argv.param) argv.param = "";

var hk = new HK({
	host: argv.host, 
	port: argv.port
});

//hk.runCommand(argv.cmd, argv.param);
//hk.powerState(function(isPowered){
//	console.log('is powered: ', isPowered);
//})