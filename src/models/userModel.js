const db = require('../config/database');

const getUserByUsernameOrEmail = async (usernameOrEmail) => {
    try {
        const query = 'SELECT * FROM users WHERE username = $1 OR email = $1';
        const { rows } = await db.query(query, [usernameOrEmail]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

const saveToken = async (token,id) => {
    //console.log("saveToken", token, id)
    try {
        console.log(token.token,id)
        const query = 'UPDATE users SET token = $1 WHERE id = $2 RETURNING *';
        
        const rows = await db.query(query, [token.token,id]);
        console.log(rows,'masuk save token')
        return rows[0]; // Return the updated user row
    } catch (error) {
        console.error('Error saving token:', error);
        throw error;
    }
}

const createUser = async (username, email, password, token) => {
    try {
        const query = 'INSERT INTO users (username, email, password, token) VALUES ($1, $2, $3, $4) RETURNING *';
        const { rows } = await db.query(query, [username, email, password, token]);
        return rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const getUserByToken = async (id,token) => {
    try {

        const query = 'SELECT * FROM users WHERE token = $1';
        const { rows } = await db.query(query, [id,token]);
        //console.log(query);
        return rows[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Function to save queuing information
const saveQueueInfo = async (id, no_rek, keperluan) => {
    try {
        const user = await db.findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        // Save queuing information to the user document
        user.queueInfo = {
            no_rek,
            keperluan,
        };

        await user.save();

        return user.queueInfo; // Return the saved queuing information if needed
    } catch (error) {
        throw error;
    }
};



//fungsi save generate number queue teller
const saveNumberQueueTeller = async () => {
    try {
        const user = await db.findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        // Save queuing information to the user document
        user.queueInfo = {
            newQueueNumberTeller
        };

        await user.save();

        return user.queueInfo; // Return the saved queuing information if needed
    } catch (error) {
        throw error;
    }
};

//fungsi save generate number queue teller
const saveNumberQueueCS = async () => {
    try {
        const user = await db.findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        // Save queuing information to the user document
        user.queueInfo = {
            newQueueNumberCS
        };

        await user.save();

        return user.queueInfo; // Return the saved queuing information if needed
    } catch (error) {
        throw error;
    }
};

// fungsi utk ambil antrain dr database yang ydg digenerate ke frontend(1) 
const getNumberQueueByUsernameOrEmail = async (usernameOrEmail) => {
    try {
        const query = 'SELECT * FROM users WHERE username = $1 OR email = $1';
        const { rows } = await db.query(query, [usernameOrEmail]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};
module.exports = { getUserByUsernameOrEmail, createUser,saveToken, getUserByToken ,saveQueueInfo,getNumberQueueByUsernameOrEmail,saveNumberQueueTeller,saveNumberQueueCS };
