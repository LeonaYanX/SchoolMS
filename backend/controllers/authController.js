const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    // Извлекаем данные из тела запроса
    const { firstName, lastName, role, password, email,IsPassChangeAvailable,IsBlocked,IsApproved } = req.body;
    console.log('Request body:', req.body); // Вывод данных, отправленных с формы
    // Проверяем, что все данные заполнены
    if (!firstName || !lastName || !role || !password || !email ) {
        return res.status(400).json({
            error: 'Registration failed',
            details: 'All fields are required.',
        });
    }


    try {
         // Проверка существующего пользователя
         const existingUser = await User.findOne({ email });
         if (existingUser) {
             return res.status(400).json({ error: 'Email already in use.' });}
        // Создаем нового пользователя
        const newUser = new User({ firstName, lastName, role, password, email,
            IsPassChangeAvailable:true,
            IsBlocked:false,
            IsApproved:false // Понять как проверить что Админ заверил и назначить
         });
        await newUser.save();

        // Отправляем успешный ответ
        res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        // Обрабатываем ошибки, если они есть
        res.status(400).json({
            error: 'Registration failed',
            details: error.message,
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ищем пользователя по email
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Генерируем JWT токен
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Отправляем успешный ответ с токеном
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};
