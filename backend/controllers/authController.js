const User = require('../models/user');
const sendEmail = require('../utils/emailService');// Подключение почтового модуля
const jwtConfig = require('../config/jwt'); 
const { generateToken} = require('../utils/token');

exports.register = async (req, res) => {
    
    const { firstName, lastName, role, password, email } = req.body;
    console.log('Request body:', req.body); 
    
    try {
         
         const existingUser = await User.findOne({ email });
         if (existingUser) {
             return res.status(400).json({ error: 'Email already in use.' });}
        
        const newUser = new User({ firstName, lastName, role, password, email,
            IsPassChangeAvailable:true,
            IsBlocked:false,
            IsApproved:false 
         });
        await newUser.save();
          
             const subject = 'Registration Successful';
             const text = `Dear ${firstName},\n\nYou have successfully registered on our website. Please wait for admin approval before accessing your account.\n\nBest regards,\n${process.env.TEAM_NAME} Team`;
             const html = `<p>Dear ${firstName},</p><p>You have successfully registered on our website. Please wait for admin approval before accessing your account.</p><p>Best regards,<br>${process.env.TEAM_NAME} Team</p>`;

             try {
                await sendEmail(email, subject, text, html);
            } catch (emailError) {
                console.error('Failed to send email:', emailError.message);
            }
        
        res.status(201).json({ message: 'Registered successfully.A confirmation email has been sent to your address.' });
    } catch (error) {
        
        res.status(500).json({
            error: 'Registration failed',
            details: error.message,
        });
    }
};

exports.login = async (req, res) => {
    const { email, password} = req.body;

    try {
        
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
          if(!user.IsApproved){
            return res.status(403).json({error:'You account is not approved yet'});
          }

          
        if (user.IsBlocked) {
            await user.checkAndUnblock(); // Проверяем срок блокировки
            if (user.IsBlocked) { // Если всё ещё заблокирован
                return res.status(403).json({ error: 'Your account is blocked by the administration.' });
            }
        }
        
          // Обновляем время последнего входа
          user.lastLogin = new Date();
          await user.save();
          
        
        const token = generateToken(
            { id: user._id, email: user.email },
            
             jwtConfig.expiresIn
            
        );

        
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};
