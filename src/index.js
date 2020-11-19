const express = require('express')
const app = express()
const port = 3000;

let accounts = new Map()

accounts.set('adam',3000)
accounts.set('eve',3020)
accounts.set('mega-corp',99999)

app.get('/', (req,res) => {
	res.send('Hello world');
})

app.get('/account/:name/balance', (req,res) => {
	const name = req.params["name"];
	if(accounts.has(name)){
		res.send(`current account balance for ${name}: ${accounts.get(name)}`);
	}else{
		res.status(404).send("No account found...");
	}
})

app.get('/account/:name/withdraw/:ammount(\\d+)', (req,res) => {
	const name = req.params["name"]
	const ammount = parseInt(req.params["ammount"])

	if(accounts.has(name)){
		const balance = accounts.get(name)

		if(ammount <= balance){
			const new_balance = balance - ammount;
			accounts.set(name,new_balance);
			res.send(`The withdrawal of ${ammount} from account ${name} was successfull.\n current balance ${new_balance}`)
			return
		}
		else{
			res.status(400).send("Error: withdrawal amount larger than current balance")
			return
		}
	}
	res.status(404).send("No account found...")
})

app.get('/account/:name/deposit/:ammount(\\d+)', (req,res) => {
	const name = req.params["name"]
	const ammount = parseInt(req.params["ammount"])

	if(accounts.has(name)){
		const balance = accounts.get(name)

		const new_balance = balance + ammount;
		accounts.set(name,new_balance);
		res.send(`The deposit of ${ammount} from account ${name} was successfull.\n current balance ${new_balance}`)

	}
	res.status(404).send("No account found...")
})


app.get('/transfere/:from/:to/:ammount(\\d+)', (req,res) => {
	const from = req.params["from"]
	const to = req.params["to"]
	const ammount = parseInt(req.params["ammount"])

	if(accounts.has(from) && accounts.has(to)){
		const from_balance = accounts.get(from)
		if(ammount <= from_balance){
			const new_from_balance = from_balance - ammount;
			const new_to_balance = accounts.get(to) +  ammount;

			accounts.set(from, new_from_balance);
			accounts.set(to, new_to_balance);

			res.send(`The amount of ${ammount} has been transfered from ${from} to ${to}`)
			return
		}
		res.status(400).send(`The sender does not have the balance to transfere amount`)
		return
	}
	res.status(404).send("No account found...")
})

app.listen(port, () => {
	console.log(`SafeBank is running on http://localhost:${port}`);
})