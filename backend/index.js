require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const corsOptions = require('./config/cors');
//const expHbs = require('express-handlebars');
const userRoutes = require('./routs/userRoutes');
const authRoutes = require('./routs/authRoutes');
const adminRoutes = require('./routs/adminRoutes');
const teacherRoutes = require('./routs/teacherRouts');
const errorHandler = require('./middlewares/errorHandler');
const swaggerSetup = require('./config/swagger');

const {schedulePasswordUpdate, scheduleUnblockUsers} = require('./utils/scheduler');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Подключение Swagger
  swaggerSetup(app);
  
  app.use(cors(corsOptions)); // using cors for all app

//Connect to DB
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);                                    // exit the process if connection is failed
});;

// Routes
app.use('/', authRoutes);
app.use('/admin',adminRoutes);
app.use('/user', userRoutes);
app.use('/teacher', teacherRoutes);
app.use(errorHandler); // Always add it last

// Starting shedules

schedulePasswordUpdate();
scheduleUnblockUsers();

//starting Server

const PORT = process.env.PORT || 3333;
app.listen(PORT,()=>{
    console.log(`Server started on :${PORT} port`);
});