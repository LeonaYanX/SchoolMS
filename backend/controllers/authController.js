const User = require('../models/user');
const sendEmail = require('../utils/emailService');// Подключение почтового модуля
const jwtConfig = require('../config/jwt'); 
const { generateToken} = require('../utils/token');

exports.register = async (req, res) => {
    // Извлекаем данные из тела запроса
    const { firstName, lastName, role, password, email } = req.body;
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
            IsApproved:false 
         });
        await newUser.save();
          // Отправка email пользователю
             const subject = 'Registration Successful';
             const text = `Dear ${firstName},\n\nYou have successfully registered on our website. Please wait for admin approval before accessing your account.\n\nBest regards,\n${process.env.TEAM_NAME} Team`;
             const html = `<p>Dear ${firstName},</p><p>You have successfully registered on our website. Please wait for admin approval before accessing your account.</p><p>Best regards,<br>${process.env.TEAM_NAME} Team</p>`;

             try {
                await sendEmail(email, subject, text, html);
            } catch (emailError) {
                console.error('Failed to send email:', emailError.message);
            }
        // Отправляем успешный ответ
        res.status(201).json({ message: 'Registered successfully.A confirmation email has been sent to your address.' });
    } catch (error) {
        // Обрабатываем ошибки, если они есть
        res.status(500).json({
            error: 'Registration failed',
            details: error.message,
        });
    }
};

exports.login = async (req, res) => {
    const { email, password} = req.body;

    try {
        // Ищем пользователя по email
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
          if(!user.IsApproved){
            return res.status(403).json({error:'You account is not approved yet'});
          }

          // Проверяем и разблокируем, если срок истёк
        if (user.IsBlocked) {
            await user.checkAndUnblock(); // Проверяем срок блокировки
            if (user.IsBlocked) { // Если всё ещё заблокирован
                return res.status(403).json({ error: 'Your account is blocked by the administration.' });
            }
        }
        
          // Обновляем время последнего входа
          user.lastLogin = new Date();
          await user.save();
          
        // Генерируем JWT токен
        const token = generateToken(
            { id: user._id, email: user.email },
            
             jwtConfig.expiresIn
            
        );

        // Отправляем успешный ответ с токеном
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};
