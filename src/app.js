const express = require('express')
const SafeBank = require('./bank.js')

const app = express()
const bank = SafeBank.bank;
const port = 3000;

app.use(express.urlencoded({
	extended: true
  }))


app.get('/', (req,res) => {

	let ctx = {accounts: bank.iter_accounts()}

	if(req.query.transfer === "success"){
		ctx.status_exists = true;
		ctx.status = true;
	}
	else if(req.query.transfer === "failed"){
		ctx.status_exists = true;
		ctx.status = false;
	}
	res.render('client', ctx);
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


app.post('/transfer', (req,res) => {

	// Validate Input

	if(req.body.to === undefined){
		res.status(400).end()
		return
	}

	if(!req.body.from){
		res.status(400).end()
		return
	}

	if(!req.body.amount || isNaN(req.body.amount)){
		res.status(400).end()
		return
	}

	const from = req.body.from
	const to = req.body.to
	const amount = parseInt(req.body.amount)

	// Run transfer

	if(!bank.account_exists(from) || !bank.account_exists(to)){
		res.status(404).end()
		return
	}
	
	const transfer_result = bank.account_transfer(from,to,amount)
	
	console.log(transfer_result);

	if(!transfer_result){
		res.redirect("/?transfer=failed")
		return
	}

	res.redirect("/?transfer=success");
})


app.set('view engine', 'hbs')

app.listen(port, () => {
	console.log(`SafeBank is running on http://localhost:${port}`)
})