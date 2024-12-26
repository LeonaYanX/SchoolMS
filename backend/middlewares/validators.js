exports.validateRegister = (req, res, next) => {
    const { firstName, lastName, role, password, email } = req.body;

    if (!firstName || !lastName || !role || !password || !email) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    next();
};
