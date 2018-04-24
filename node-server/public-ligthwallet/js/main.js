var web3 = new Web3();
var global_keystore;

function setWeb3Provider(keystore) {
  var web3Provider = new HookedWeb3Provider({
    host: "http://localhost:8545", 				// 私链 
    //host: "https://rinkeby.infura.io/",		// 以太坊测试  
    //host: "https://ropsten.infura.io/",		// 以太坊测试 (ropsten)
    transaction_signer: keystore
  });

  web3.setProvider(web3Provider);
}

function newAddresses(password) {

  if (password == '') {
    password = prompt('Enter password to retrieve addresses', 'Password');
  }

  var numAddr = parseInt(document.getElementById('numAddr').value)

  global_keystore.keyFromPassword(password,
  function(err, pwDerivedKey) {

    global_keystore.generateNewAddress(pwDerivedKey, numAddr);

    var addresses = global_keystore.getAddresses();

    document.getElementById('sendFrom').innerHTML = ''
	document.getElementById('functionCaller').innerHTML = ''
    for (var i = 0; i < addresses.length; ++i) {
      document.getElementById('sendFrom').innerHTML += '<option value="' + addresses[i] + '">' + addresses[i] + '</option>'
	  document.getElementById('functionCaller').innerHTML += '<option value="' + addresses[i] + '">' + addresses[i] + '</option>'
    }

    getBalances();
  })
}

function getBalances() {

  var addresses = global_keystore.getAddresses();
  document.getElementById('addr').innerHTML = 'Retrieving addresses...'

  async.map(addresses, web3.eth.getBalance,
  function(err, balances) {
    async.map(addresses, web3.eth.getTransactionCount,
    function(err, nonces) {
      document.getElementById('addr').innerHTML = ''
      for (var i = 0; i < addresses.length; ++i) {
        document.getElementById('addr').innerHTML += '<div>' + addresses[i] + ' (Bal: ' + (balances[i] / 1.0e18) + ' ETH, Nonce: ' + nonces[i] + ')' + '</div>'
      }
    })
  })
}

function setSeed() {
  //var password = prompt('Enter Password to encrypt your seed', 'Password');
  
  var password = '123456';

  lightwallet.keystore.createVault({
    password: password,
    seedPhrase: document.getElementById('seed').value,
    //random salt 
    hdPathString: "m/44'/60'/0'/0"
  },
  function(err, ks) {

    global_keystore = ks

    document.getElementById('seed').value = ''

    newAddresses(password);
    setWeb3Provider(global_keystore);

    //getBalances();
  })
}

function newWallet() {
  var extraEntropy = document.getElementById('userEntropy').value;
  document.getElementById('userEntropy').value = '';
  var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);

  var infoString = 'Your new wallet seed is: "' + randomSeed + '". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. ' + 'Please enter a password to encrypt your seed while in the browser.'
  var password = prompt(infoString, 'Password');

  lightwallet.keystore.createVault({
    password: password,
    seedPhrase: randomSeed,
    //random salt 
    hdPathString: "m/44'/60'/0'/0"
  },
  function(err, ks) {

    global_keystore = ks

    newAddresses(password);
    setWeb3Provider(global_keystore);
    getBalances();
  })
}

function showSeed() {
  var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', 'Password');

  global_keystore.keyFromPassword(password,
  function(err, pwDerivedKey) {
    var seed = global_keystore.getSeed(pwDerivedKey);
    alert('Your seed is: "' + seed + '". Please write it down.');
  });
}

function sendEth() {
  var fromAddr = document.getElementById('sendFrom').value
  var toAddr = document.getElementById('sendTo').value
  var valueEth = document.getElementById('sendValueAmount').value
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 18000000000
  var gas = 50000 
  web3.eth.sendTransaction({
    from: fromAddr,
    to: toAddr,
    value: value,
    gasPrice: gasPrice,
    gas: gas
  },
  function(err, txhash) {
    console.log('error: ' + err) 
	console.log('txhash: ' + txhash)

    //document.getElementById('info').innerHTML += '<div>' + txhash  + '</div>'
  })
}

function functionCall() {
  var fromAddr = document.getElementById('functionCaller').value
  var contractAddr = document.getElementById('contractAddr').value
  var abi = JSON.parse(document.getElementById('contractAbi').value) 
  var contract = web3.eth.contract(abi).at(contractAddr) 
  var functionName = document.getElementById('functionName').value
  var args = JSON.parse('[' + document.getElementById('functionArgs').value + ']') 
  var valueEth = document.getElementById('sendValueAmount').value
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 18000000000
  var gas = 50000 
  
  args.push({
    from: fromAddr,
    value: value,
    gasPrice: gasPrice,
    gas: gas
  }) 
  
  var callback = function(err, txhash) {
    console.log('error: ' + err) 
	console.log('txhash: ' + txhash)

    document.getElementById('info').innerHTML += '<div>' + err + '</div>'

  }
  args.push(callback) 
  contract[functionName].apply(this, args)
}

function functionCall000bak() {
  var fromAddr = '0x10592A6daD0055c586bb95474e7056F72462997A'
  //var toAddr = '0x10592A6daD0055c586bb95474e7056F72462997A'
  //var contractAddr = '0x4348d8c05d4aa63fa4201f4d605e916f15bae1b3'		// multiply7
  var contractAddr = '0x11769e3b12d34da9a33c1d3f08e8851a2a0528b5'    // erc20
  
  //var abi = [{"constant":true,"inputs":[{"name":"a","type":"uint256"}],"name":"multiply","outputs":[{"name":"d","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"uint256"}],"name":"Print","type":"event"}]    // multiply7
  var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]

   
  //var args = JSON.parse('[' + document.getElementById('functionArgs').value + ']') 
  
  var args = 66  
  
  var contract = web3.eth.contract(abi).at(contractAddr) 
  
  //var functionName = 'transfer' 
 
  
  var valueEth = 0.01
  
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 18000000000
  var gas = 50000 
  
  //res = contract.balanceOf(toAddr)			//查地址的余额
  res = contract.symbol()
  
  document.getElementById('info').innerHTML += '<div>' + res + '</div>' 

}

// 根据当前帐户地址 和 合约地址，查询代表名称、余额
function addToken() { 

  var fromAddr = '0x10592A6daD0055c586bb95474e7056F72462997A'

  var contractAddr = '0x11769e3b12d34da9a33c1d3f08e8851a2a0528b5'    // erc20 合约地址
  
  var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]
  var contract = web3.eth.contract(abi).at(contractAddr)  
  
  //res = contract.balanceOf(toAddr)			
  symbol = contract.symbol()
  decimals = contract.decimals()			//小数点位数
  balances = contract.balanceOf(fromAddr)     //查地址的余额
  
  document.getElementById('info').innerHTML += '<div>' + ' (Bal: ' + (balances / 1.0e18) + ')' + symbol  + '</div>' 
}

// 转账代币
// 输入参数 转出帐户地址，转出代币数量，转出代币的简称（symbol）
// 调用成功，返回 tx
function sendToken() {
  var from = '0x10592A6daD0055c586bb95474e7056F72462997A'    
  var to = '0xDA6167c2d6c0d4Ac40860CAB6E003dAfe3307492' 
  var valueToken = document.getElementById('valueAmount').value
  //var valueToken = 66 
  var value = parseFloat(valueToken) * 1.0e18
  
  var contractAddr = '0x11769e3b12d34da9a33c1d3f08e8851a2a0528b5'    // erc20 合约地址
  
  var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]
  var token = web3.eth.contract(abi).at(contractAddr)   
  
  var args = [ to , value]     //转账参数，给 to地址转 value个代币
  
  
  var gasPrice = 18000000000
  var gas = 150000 
  args.push({
    from: from,
    value: '0x00',
    gasPrice: gasPrice,
    gas: gas
  }) 
  
  var callback = function(err, txhash) {
    console.log('error: ' + err) 
	console.log('txhash: ' + txhash)

    document.getElementById('info').innerHTML += '<div>' + err + '</div>'

  }
  args.push(callback) 
  token.transfer.apply(this, args)  
}

