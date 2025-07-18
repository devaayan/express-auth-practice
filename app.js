const express = require('express')
const app = express()
const UserModel = require('./models/user')
const path = require('path')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.set('view engine', "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    res.render('index')
})
app.post('/create', function (req, res) {
    let { username, email, password, age } = req.body;
    bcrypt.genSalt(10, function (err, salt) {

        bcrypt.hash(password, salt, async function (err, hash) {
            let CreatedUser = await UserModel.create({
                username,
                email,
                password: hash,
                age
            })
            let token = jwt.sign({ email }, "mysecretkey")
            res.cookie('token', token)
            res.send(`User Create <a href="/"> Go back</a>`)
        });
    });

})

app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
        return res.send("something went wrong")
    }
    else {
        bcrypt.compare(req.body.password, user.password, function (err, result) {
            console.log(result)
            if (result) {
                let token = jwt.sign({email: user.email}, "mysecretkey")
                res.cookie('token', token)
                res.send("Yes you can login")
            }
            else {
                res.send("Something is wrong")
            }
        })
    }
})



app.get('/logout', (req, res) => {
    res.cookie('token', '')
    res.redirect('/')
})
app.listen(3000)