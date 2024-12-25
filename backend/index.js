require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routs/authRoutes');
const expHbs = require('express-handlebars')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const hbs = expHbs.create({ // настройка ХБС
    defaultLayout:'main',    // главный лейаут мейн
    extname:'hbs'      // разширение ХБС
})
app.engine('hbs',hbs.engine) // подключаем движок по ключу ХБС
app.set('view engine', 'hbs')//Для того чтобы по дефолту использовать ХБС настройка имя должно 
// совпадать с строчкой в апп.энджин - 'ХБс'
app.set('views','views') // Настраиваю место где будет находиться вю нашего приложения по ключу views



//Connect to DB
connectDB();

// Routes
app.use('/', authRoutes);

//starting Server

const PORT = process.env.PORT || 3333;
app.listen(PORT,()=>{
    console.log(`Server started on :${PORT} port`);
});