var web3 = new Web3();
//var global_keystore;

function setWeb3Provider(keystore) {
  var web3Provider = new HookedWeb3Provider({
    //host: "http://localhost:8545", 				// 私链 
    //host: "https://rinkeby.infura.io/",		// 以太坊测试  
    //host: "https://ropsten.infura.io/",		// 以太坊测试 (ropsten)
	host: "https://mainnet.infura.io/",					// 以太坊正式网
    transaction_signer: keystore
  });

  web3.setProvider(web3Provider);
}
 
 

// 根据当前帐户地址 和 合约地址，查询代表名称、余额
function addToken() { 

  var fromAddr = '0x10592A6daD0055c586bb95474e7056F72462997A'

  var contractAddr = '0xa4d17ab1ee0efdd23edc2869e7ba96b89eecf9ab'    // true 合约地址  
  
  var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]

  ///////////////////////////////////////
  var serialized_keystore =   localStorage.getItem('keystore')   
  keystore = lightwallet.keystore.deserialize(serialized_keystore)    //将序列号的keystore转换为对象  
  setWeb3Provider(keystore)	
  //////////////////////////////////////////////////
  
  var contract = web3.eth.contract(abi).at(contractAddr)   
 			
  name = contract.name()					// 代币全称
  symbol = contract.symbol()				// 代币简称
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
  
  var contractAddr = '0xa4d17ab1ee0efdd23edc2869e7ba96b89eecf9ab'    // true 合约地址 
  
  var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"supply","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]
  
  ///////////////////////////////////////
  var serialized_keystore =   localStorage.getItem('keystore')   
  keystore = lightwallet.keystore.deserialize(serialized_keystore)    //将序列号的keystore转换为对象  
  setWeb3Provider(keystore)	
  //////////////////////////////////////////////////
  
  var contract = web3.eth.contract(abi).at(contractAddr)   
  
  var args = [ to , value]     //转账参数，给 to地址转 value个代币
  
  
  var gasPrice = 21000000000
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

