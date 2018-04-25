 

// 根据助记词恢复账号
function setSeed() { 
  
    var seed = document.getElementById('seed').value 
	
	// the seed is stored encrypted by a user-defined password
	var password = prompt('Enter password for encryption', 'Password');
	var hdPath = "m/44'/60'/0'/0"

	lightwallet.keystore.createVault({
	  password: password,
	  seedPhrase: seed, // Optionally provide a 12-word seed phrase
	  // salt: fixture.salt,     // Optionally provide a salt.
								 // A unique salt will be generated otherwise.
	  hdPathString: hdPath    // Optional custom HD Path String
	}, function (err, ks) { 
		
		localStorage.setItem('keystore', ks.serialize())   //本地 keystore 的序列号存储

	  // Some methods will require providing the `pwDerivedKey`,
	  // Allowing you to only decrypt private keys on an as-needed basis.
	  // You can generate that value with this convenient method:
	  ks.keyFromPassword(password, function (err, pwDerivedKey) {
		if (err) throw err;

		// generate five new address/private key pairs
		// the corresponding private keys are also encrypted
		ks.generateNewAddress(pwDerivedKey, 1);
		var addr = ks.getAddresses();
		
		// 输出展示，正式中可以去掉
		document.getElementById('addr').innerHTML = ''
		for (var i = 0; i < addr.length; ++i) {
		  document.getElementById('addr').innerHTML += '<div>' + addr[i]  + '</div>'
		}	
		//////////////////

		ks.passwordProvider = function (callback) {
		  var pw = prompt("Please enter password", "Password");
		  callback(null, pw);
		};

		// Now set ks as transaction_signer in the hooked web3 provider
		// and you can start using web3 using the keys/addresses in ks!
	  });
	});  
}

 

//  创建钱包
function newWallet() {
  var extraEntropy = document.getElementById('userEntropy').value;
  document.getElementById('userEntropy').value = '';
  var seed = lightwallet.keystore.generateRandomSeed(extraEntropy);

  var infoString = 'Your new wallet seed is: "' + seed + '". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. ' + 'Please enter a password to encrypt your seed while in the browser.'
    
  var password = prompt(infoString, 'Password');
  var hdPath = "m/44'/60'/0'/0"

	lightwallet.keystore.createVault({
	  password: password,
	  seedPhrase: seed, // Optionally provide a 12-word seed phrase
	  // salt: fixture.salt,     // Optionally provide a salt.
								 // A unique salt will be generated otherwise.
	  hdPathString: hdPath    // Optional custom HD Path String
	}, function (err, ks) {
		localStorage.setItem('keystore', ks.serialize())   //本地 keystore 的序列号存储

	  // Some methods will require providing the `pwDerivedKey`,
	  // Allowing you to only decrypt private keys on an as-needed basis.
	  // You can generate that value with this convenient method:
	  ks.keyFromPassword(password, function (err, pwDerivedKey) {
		if (err) throw err;

		// generate five new address/private key pairs
		// the corresponding private keys are also encrypted
		ks.generateNewAddress(pwDerivedKey, 1);
		var addr = ks.getAddresses();
		
		// 输出展示，正式中可以去掉
		document.getElementById('addr').innerHTML = ''
		for (var i = 0; i < addr.length; ++i) {
		  document.getElementById('addr').innerHTML += '<div>' + addr[i]  + '</div>'
		}	
		//////////////////

		ks.passwordProvider = function (callback) {
		  var pw = prompt("Please enter password", "Password");
		  callback(null, pw);
		};

		// Now set ks as transaction_signer in the hooked web3 provider
		// and you can start using web3 using the keys/addresses in ks!
	  });
	});  
}


// 显示助记词
function showSeed() {  
 
  var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', 'Password');
  
  var serialized_keystore =   localStorage.getItem('keystore')   
  global_keystore = lightwallet.keystore.deserialize(serialized_keystore)    //将序列号的keystore转换为对象 
 
  global_keystore.keyFromPassword(password,
  function(err, pwDerivedKey) {
	var seed = global_keystore.getSeed(pwDerivedKey);
	alert('Your seed is: "' + seed + '". Please write it down.');
  }); 
 
}

 
 

