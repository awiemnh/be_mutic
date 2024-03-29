const model = require('../models/userModel');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        
        const user = await model.getUserByUsernameOrEmail(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        await model.saveToken({token}, user.id);
        
        res.json({ token });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.signUp = async (req, res) => {
    const { username, email, password } = req.body; // Remove 'token' from destructuring
    try {
        // Check if the username or email already exists in the database
        const existingUser = await model.getUserByUsernameOrEmail(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10); 

        // Create a new user with the provided information
        const newUser = await model.createUser(username, email, hashedPassword);
        
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    //console.log('params', req.body)
    const { username } = req.body;
    const token = req.headers.authorization;
    //console.log('tokennya',token,username)

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }   

    try {
        const authToken = token.split(' ')[1];
        const user = await model.getUserByUsernameOrEmail(username);

        if (!user || user.token !== authToken) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        await model.saveToken( {token: null},user.id);

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.user = async(req,res)=>{
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }   

    try {
        const authToken = token.split(' ')[1];
        const user = await model.getUserByToken(authToken);
        console.log (user,authToken,'check user');
        if (!user || user.token !== authToken) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        res.json(user.username);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        }
};

exports.queueTeller = async (req, res) => {
    const { username, no_rek, keperluan } = req.body;
    console.log("norek", no_rek);
    console.log("keperluan", keperluan);
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }

    try {
        const authToken = token.split(' ')[1];
        const user = await model.getUserByToken(authToken);

        if (!user || user.token !== authToken) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Generate sequential queue number (1 to 100)
        const queueNumber = await model.getNextQueueNumberTeller();

        // Save queuing information
        await model.saveQueueInfo(username, no_rek, keperluan, queueNumber);

        // Update the no_antrian_teller column in the database
        await model.saveNumberQueueTeller(no_rek, queueNumber);

        res.status(200).json({ message: 'Queue information saved successfully', queueNumber });
    } catch (error) {
        console.error('Error during queuing:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.queueCS = async (req, res) => {
    const { username, no_rek, keperluan } = req.body;
    console.log("norek", no_rek);
    console.log("keperluan", keperluan);
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
    }

    try {
        const authToken = token.split(' ')[1];
        const user = await model.getUserByToken(authToken);

        if (!user || user.token !== authToken) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Generate sequential queue number (1 to 100)
        const queueNumber = await model.getNextQueueNumberCS();

        // Save queuing information
        await model.saveQueueInfo(username, no_rek, keperluan, queueNumber);

        // Update the no_antrian_teller column in the database
        await model.saveNumberQueueCS(no_rek, queueNumber);

        res.status(200).json({ message: 'Queue information saved successfully', queueNumber });
    } catch (error) {
        console.error('Error during queuing:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

