require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const corsOptions = require('./config/cors');
const expHbs = require('express-handlebars');
const userRoutes = require('./routs/userRoutes');
const authRoutes = require('./routs/authRoutes');
const adminRoutes = require('./routs/adminRoutes');
const teacherRoutes = require('./routs/teacherRouts');
const errorHandler = require('./middlewares/errorHandler');


const {schedulePasswordUpdate, scheduleUnblockUsers} = require('./utils/scheduler');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


  
  app.use(cors(corsOptions)); // для всего приложения

const hbs = expHbs.create({ // настройка ХБС
    defaultLayout:'main',    // главный лейаут мейн
    extname:'hbs'      // разширение ХБС
})
app.engine('hbs',hbs.engine) // подключаем движок по ключу ХБС
app.set('view engine', 'hbs')//Для того чтобы по дефолту использовать ХБС настройка имя должно 
// совпадать с строчкой в апп.энджин 
app.set('views','views') // Настраиваю место где будет находиться вю нашего приложения по ключу views



//Connect to DB
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);                                    // Завершаем процесс при ошибке подключения
});;

// Routes
app.use('/', authRoutes);
app.use('/admin',adminRoutes);
app.use('/user', userRoutes);
app.use('/teacher', teacherRoutes);
app.use(errorHandler); // всегда добавлять последним

// Starting shedules

schedulePasswordUpdate();
scheduleUnblockUsers();

//starting Server

const PORT = process.env.PORT || 3333;
app.listen(PORT,()=>{
    console.log(`Server started on :${PORT} port`);
});