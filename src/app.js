const express = require('express')
const SafeBank = require('./bank.js')

const app = express()
const bank = SafeBank.bank;
const port = 3000;

app.get('/', (req,res) => {
	const accounts = bank.iter_accounts();
	res.render('client', {title: accounts});
})

app.get('/balance', (req,res) => {

	//Validate Input

	if(!req.query.name){
		res.status(404).send("Please specify the name of the account")
		return
	}

	const name = req.query.name

	if(!bank.account_exists(name)){
		res.status(404).send("No account found...")
		return
	}

	// Check balance

	const balance = bank.account_balance(name)
	res.send(`current account balance for ${name}: ${balance}`);
})


app.get('/transfer', (req,res) => {

	// Validate Input

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

	// Run transfer

	if(!bank.account_exists(from) || !bank.account_exists(to)){
		res.status(404).send("No account found...")
		return
	}
	
	const transfer_result = bank.account_transfer(from,to,amount)
	
	if(!transfer_result){
		res.status(400).send(`The account does not have the balance to transfer amount`)
		return
	}

	res.send(`The amount of ${amount} has been transfered from ${from} to ${to}`)
})

app.set('view engine', 'hbs')

app.listen(port, () => {
	console.log(`SafeBank is running on http://localhost:${port}`)
})