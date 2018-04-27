var web3 = new Web3();

function setWeb3Provider(keystore) {
  var web3Provider = new HookedWeb3Provider({
    //host: "http://localhost:8545", 				// 私链 
    //host: "https://rinkeby.infura.io/",		// 以太坊测试  
    host: "https://ropsten.infura.io/",		// 以太坊测试 (ropsten)
    transaction_signer: keystore
  });

  web3.setProvider(web3Provider);
} 

 

function sendEth() {
  var serialized_keystore =   localStorage.getItem('keystore')   
  keystore = lightwallet.keystore.deserialize(serialized_keystore)    //将序列号的keystore转换为对象 
  
  setWeb3Provider(keystore)	
	
  //var fromAddr = document.getElementById('sendFrom').value
  //var toAddr = document.getElementById('sendTo').value
  
  var fromAddr = '0x10592A6daD0055c586bb95474e7056F72462997A'    
  var toAddr = '0x5833fa6053e6e781eafb8695d63d90f6b3571e5e'  
  
  var valueEth = document.getElementById('sendValueAmount').value
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 20000000000
  var gas = 21001 
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
 
