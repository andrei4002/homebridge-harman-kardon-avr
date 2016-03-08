var HK = require('./hk');

var argv = require('minimist')(process.argv.slice(2));

if (!argv.cmd){
    console.log("\nusage: \n node index.js --url=your-url(optional, default is http://192.168.1.184) --cmd=your-cmd --param=your-param(optional, default is blank)\n");
    process.exit(1);
}

if (!argv.url) argv.url = "http://192.168.1.184";
if (!argv.param) argv.param = "";

var hk = new HK({
    url: argv.url
});


// hk.runCommand(argv.cmd, argv.param);

hk.powerState(function(isPowered){
	console.log('is powered: ', isPowered);
})