var http = require('http');
http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html;charset=utf-8'
    });
    var Web3 = require('web3'); 
	
    var web3 = new Web3();
	//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));		// 本地私链，测试网络
    web3.setProvider(new web3.providers.HttpProvider('https://rinkeby.infura.io/'));	// 以太坊测试链接
	//web3.setProvider(new web3.providers.HttpProvider('https://api.myetherapi.com/rop'));	// 以太坊测试
	
	//console.log(web3.eth.accounts[0]);
	var address = "0x9588ba431d63e03cb17db8e2f35d0882289049f7";
	console.log(address); 
    var balance = web3.fromWei(web3.eth.getBalance(address), 'ether');
	console.log(balance); 
 
	
    res.write('<h2>');
    res.write('当前主账户帐号为：');
    res.write('</h1>');
    res.write('<p>');
    res.write(address);
    res.write('</p>');
    res.write('<h2>');
    res.write('以太币余额为：');
    res.write('</h1>');
    res.write('<p>');
    res.write(balance.toString());
    res.write('</p>');
    res.end();
	
}).listen(3000); //监听3000端口
console.log('Server is running');