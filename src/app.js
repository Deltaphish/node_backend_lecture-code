const express = require('express')
const app = express()
const port = 3000;

let accounts = new Map()

accounts.set('adam',3000)
accounts.set('eve',3020)
accounts.set('mega-corp',99999)


app.get('/', (req,res) => {
	res.sendFile(__dirname + "/client.html");
})

app.get('/balance', (req,res) => {

	if(!req.query.name){
		res.status(404).send("Please specify the name of the account")
		return
	}

	if(!accounts.has(name)){
		res.status(404).send("No account found...")
		return
	}

	const name = req.query.name
	const balance = accounts.get(name)
	res.send(`current account balance for ${name}: ${balance}`);
})
/*

	withdraw and deposit is overkill?


app.get('/withdraw', (req,res) => {

	if(!req.query.name){
		res.status(400).send("Please specify the name of the account")
		return
	}

	if(!req.query.amount || isNaN(req.query.amount)){
		res.status(400).send("Please specify amount")
		return
	}


	const name = req.query.name
	const amount = parseInt(req.query.amount)

	if(accounts.has(name)){
		const balance = accounts.get(name)

		if(amount <= balance){
			const new_balance = balance - amount;
			accounts.set(name,new_balance);
			res.send(`The withdrawal of ${amount} from account ${name} was successful.`)
			return
		}
		else{
			res.status(400).send("Error: withdrawal amount larger than current balance")
			return
		}
	}
	res.status(404).send("No account found...")
})

app.get('/deposit', (req,res) => {

	if(!req.query["name"]){
		res.status(400).send("Please specify the name of the account")
		return
	}

	if(!req.query.amount || isNaN(req.query.amount)){
		res.status(400).send("Please specify amount")
		return
	}

	const name = req.query.name
	const amount = parseInt(req.query.amount)

	if(accounts.has(name)){
		const new_balance = accounts.get(name) + amount;
		accounts.set(name,new_balance);
		res.send(`The deposit of ${amount} from account ${name} was successfull`)
		return
	}
	res.status(404).send("No account found...")
})

*/
app.get('/transfer', (req,res) => {

	if(!req.query.to){
		res.status(400).send("Please specify the name of the sender")
		return
	}

	if(!req.query.from){
		res.status(400).send("Please specify the name of the recipient")
		return
	}

	if(!req.query.amount || isNaN(req.query.amount)){
		res.status(400).send("Please specify amount")
		return
	}

	const from = req.query.from
	const to = req.query.to
	const amount = parseInt(req.query.amount)

	if(!accounts.has(from) || !accounts.has(to)){
		res.status(404).send("No account found...")
		return
	}
	
	const from_balance = accounts.get(from)
	const to_balance = accounts.get(to)
	
	if(amount > from_balance){
		res.status(400).send(`The payee does not have the balance to transfere amount`)
		return
	}
		
	const new_from_balance = from_balance - amount;
	const new_to_balance = to_balance +  amount;

	accounts.set(from, new_from_balance);
	accounts.set(to, new_to_balance);

	res.send(`The amount of ${amount} has been transfered from ${from} to ${to}`)
})

app.listen(port, () => {
	console.log(`SafeBank is running on http://localhost:${port}`)
})