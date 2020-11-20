class Bank {
	constructor(init) {
		this.accounts = init
	}

	iter_accounts() {
		return Array.from(this.accounts.entries())
				.map((account) => ({name: account[0], balance: account[1]}));
	}

	account_exists(name){
		return this.accounts.has(name)
	}

	account_balance(name) {
		return this.accounts.get(name)
	}

	account_change_balance(name,fn){
		const current_balance = this.accounts.get(name)
		const new_balance = fn(current_balance)
		if(new_balance >= 0){
			this.accounts.set(name, fn(current_balance))
			return true;
		}
		else{
			return true;
		}
	}

	account_deposit(name,value){
		return this.account_change_balance(name, (x) => x + value)
	}

	account_withdraw(name,value){
		return this.account_change_balance(name, (x) => x -= value)
	}

	account_transfer(from,to,value){
		if(this.account_withdraw(from,value)){
			return this.account_deposit(to,value)
		}
		return false;
	}
}

exports.bank = new Bank(new Map([["adam",20],["eve",3000],["mega-evil-corp",999999]]))