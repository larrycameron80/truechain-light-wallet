 

function generate_seed()
{
	var new_seed = 'cause surface honey misery drip obey merge flash upgrade letter baby spread'; 
	//var new_seed = lightwallet.keystore.generateRandomSeed();

	document.getElementById("seed").value = new_seed;

	generate_addresses(new_seed);
}

var totalAddresses = 2;

function generate_addresses(seed)
{
	if(seed == undefined)
	{
		seed = document.getElementById("seed").value;
	}

	if(!lightwallet.keystore.isSeedValid(seed))
	{
		document.getElementById("info").innerHTML = "Please enter a valid seed";
		return;
	}

	totalAddresses = prompt("How many addresses do you want to generate");

	if(!Number.isInteger(parseInt(totalAddresses)))
	{
		document.getElementById("info").innerHTML = "Please enter valid number of addresses";
		return;
	}

	//var password = Math.random().toString();
	var password = 'ab123456';
 
	if (password == '') {
	  password = prompt('Enter password to retrieve addresses', 'Password');
	}	
 
	
	var hdPathString = "m/44'/60'/0'/0";

	lightwallet.keystore.createVault({
		password: password,
	  	seedPhrase: seed,
		hdPathString:hdPathString
	}, function (err, ks) {
	  	ks.keyFromPassword(password, function (err, pwDerivedKey) {
	    	if(err)
	    	{
	    		document.getElementById("info").innerHTML = err;
	    	}
	    	else
	    	{
	    		ks.generateNewAddress(pwDerivedKey, totalAddresses);
	    		var addresses = ks.getAddresses();	
				
			    var provider = new HookedWeb3Provider({
  					//host: "http://localhost:8545",				// 私链
					//host: "https://rinkeby.infura.io/",				// 以太坊测试
					host: "https://ropsten.infura.io/",				// 以太坊测试 (ropsten)
					//host: "https://mainnet.infura.io/",					// 以太坊正式网
  					transaction_signer: ks
				}); 

			    var web3 = new Web3(provider);			

	    		var html = "";

	    		for(var count = 0; count < addresses.length; count++)
	    		{
					var address = addresses[count];
					var private_key = ks.exportPrivateKey(address, pwDerivedKey);
					
					var balance = web3.eth.getBalance("0x" + address);

					html = html + "<li>";
					html = html + "<p><b>Address: </b>0x" + address + "</p>";
					html = html + "<p><b>Private Key: </b>0x" + private_key + "</p>";
					html = html + "<p><b>Balance: </b>" + web3.fromWei(balance, "ether") + " ether</p>";
		    		html = html + "</li>";
	    		}

	    		document.getElementById("list").innerHTML = html;
	    	}
	  	});
	});
}

function send_ether()
{
	var	seed = document.getElementById("seed").value;

	if(!lightwallet.keystore.isSeedValid(seed))
	{
		document.getElementById("info").innerHTML = "Please enter a valid seed";
		return;
	}

	var password = Math.random().toString();

	lightwallet.keystore.createVault({
		password: password,
	  	seedPhrase: seed
	}, function (err, ks) {
	  	ks.keyFromPassword(password, function (err, pwDerivedKey) {
	    	if(err)
	    	{
	    		document.getElementById("info").innerHTML = err;
	    	}
	    	else
	    	{
	    		ks.generateNewAddress(pwDerivedKey, totalAddresses);

	    		ks.passwordProvider = function (callback) {
			      	callback(null, password);
			    };

			    var provider = new HookedWeb3Provider({
  					//host: "http://localhost:8545",				// 私链
					//host: "https://rinkeby.infura.io/",				// 以太坊测试
					host: "https://ropsten.infura.io/",				// 以太坊测试 (ropsten)
					//host: "https://mainnet.infura.io/",					// 以太坊正式网
  					transaction_signer: ks
				});

			    var web3 = new Web3(provider);

			    var from = document.getElementById("address1").value;
				var to = document.getElementById("address2").value;
			    var value = web3.toWei(document.getElementById("ether").value, "ether");

			    web3.eth.sendTransaction({
			    	from: from,
			    	to: to,
			    	value: value,
			    	gas: 21000
			    }, function(error, result){
			    	if(error)
			    	{	
			    		document.getElementById("info").innerHTML = error;
			    	}
			    	else
			    	{
			    		document.getElementById("info").innerHTML = "Txn hash: " + result;
			    	}
			    })
	    	}
	  	});
	});
}


// 发送代币
function send_token()
{ 

	
	//var	seed = document.getElementById("seed").value; 
	var	seed = 'cause surface honey misery drip obey merge flash upgrade letter baby spread'; 

	if(!lightwallet.keystore.isSeedValid(seed))
	{
		document.getElementById("info").innerHTML = "Please enter a valid seed";
		return;
	}

	var password = Math.random().toString();

	lightwallet.keystore.createVault({
		password: password,
	  	seedPhrase: seed
	}, function (err, ks) {
	  	ks.keyFromPassword(password, function (err, pwDerivedKey) {
	    	if(err)
	    	{
	    		document.getElementById("info").innerHTML = err;
	    	}
	    	else
	    	{
	    		ks.generateNewAddress(pwDerivedKey, totalAddresses);

	    		ks.passwordProvider = function (callback) {
			      	callback(null, password);
			    };

			    var provider = new HookedWeb3Provider({
  					//host: "http://localhost:8545",				// 私链
					//host: "https://rinkeby.infura.io/",				// 以太坊测试
					host: "https://ropsten.infura.io/",				// 以太坊测试 (ropsten)
					//host: "https://mainnet.infura.io/",					// 以太坊正式网
  					transaction_signer: ks
				});

			    var web3 = new Web3(provider);

				//var from = document.getElementById("address1").value;
				//var to = document.getElementById("address2").value;	
				//var value = document.getElementById("ether").value;
				
				var from = '0x10592a6dad0055c586bb95474e7056f72462997a';
				var to   = '0x9588ba431d63e03cb17db8e2f35d0882289049f7';	
				var value = '10';				
				
				//var abi = [{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"sendCoin","outputs":[{"name":"sufficient","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"}];
				// 合约地址
				//var address = "0xb2cdd356e58280906ce53e1665697b50f88aac56"; 
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
var address = "0x84b8b3370edddbace3ddbd85165ffc97e4549db7"; 				
				

				var token = web3.eth.contract(abi).at(address);	

				//document.getElementById("info").innerHTML = token;				
document.getElementById("info").innerHTML = 'test000';
	 
				//从地址from转移value个token到地址to。success和error是回调函数
				var transfer = function(from, to, value, success, error) {
					document.getElementById("info").innerHTML = 'test001';
					/*
					try {
						//定义transaction
						var t = {
							to: '0x84b8b3370edddbace3ddbd85165ffc97e4549db7', // 因为是调用合约，所以这个是合约地址
							value: '0x00', //转移的以太币数量为0
							data: token.methods.transfer(to, value).encodeABI() //要调用的合约函数，我用的ERC20标准
						}
					} catch(e) {
						if(undefined==error){
							error = console.log
						}
						// 很可能是to地址错误
						document.getElementById("info").innerHTML = '地址错';
						//error(1)
						return
					}
				
					//获取当前gas价格
					web3.eth.getGasPrice().then(function(p) {
						t.gasPrice = web3.utils.toHex(p);
						//获取nonce
						web3.eth.getTransactionCount(from,
						function(err, r) {
							t.nonce = web3.utils.toHex(r);
							t.from = from;
							//暂时没用预估，代码先保留
							web3.eth.estimateGas(t,
							function(err, gas) {
								gas = '150000';
								t.gasLimit = web3.utils.toHex(gas);
								//初始化transaction
								var tx = new ethereumjs.Tx(t);
								var privateKey = '9549d6b8a48e136e27d317feae7a50a180fe2f7757d0e5fd0d9e2c6e94fa53ab'
								if ('0x' == privateKey.substr(0, 2)) {
									privateKey = privateKey.substr(2)
								}
								privateKey = new ethereumjs.Buffer.Buffer(privateKey, 'hex');
								//签名
								tx.sign(privateKey);
								var serializedTx = '0x' + tx.serialize().toString('hex');
								//发送原始transaction
								web3.eth.sendSignedTransaction(serializedTx,
								function(err, r) {
									if(!err){
										//根据hash获取完整的transaction，chrome开发者工具中，这里会一直有json-rpc，大概会有70多个，目前不清楚原因，知道的可以在评论区解释下
										web3.eth.getTransaction(r,
										function(err, r) {
											success(r)
										})
									}
								}).catch(function(err){
									//gas不足
									document.getElementById("info").innerHTML = 'gas不足';
									//error(2)
								});
							})
						})
						return this
					}) 
						*/ 
				} 
			 
			 
	    	}
	  	});
	}); 
} 