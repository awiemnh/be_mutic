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

const getUserByToken = async (token) => {
    try {

        const query = 'SELECT * FROM users WHERE token = $1';
        const { rows } = await db.query(query, [token]);
        //console.log(query);
        return rows[0];
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Function to save queuing information
const saveQueueInfo = async (username, no_rek, keperluan) => {
    try {
        const query = 'UPDATE users SET no_rek = $2, keperluan = $3 WHERE username = $1 RETURNING *';
        const user = await db.query(query, [username, no_rek, keperluan]);

        return user;
    } catch (error) {
        throw error;
    }
};


//fungsi save generate number queue teller
const saveNumberQueueTeller = async (no_rek,no_antrian_teller) => {
    try {
        const query = 'UPDATE users SET no_antrian_teller = $2 WHERE no_rek = $1 RETURNING *';
        const user = await db.query(query, [no_rek, no_antrian_teller]);
        return user.rows[0]; // Return the saved queuing information if needed
    } catch (error) {
        throw error;
    }
};

const getNextQueueNumberTeller = async () => {
    try {
        const result = await db.query('SELECT MAX(no_antrian_teller) FROM users');
        const lastQueueNumber = result.rows[0].max || 0;
        return lastQueueNumber + 1;
    } catch (error) {
        throw error;
    }
};

//fungsi save generate number queue CS
const saveNumberQueueCS = async (no_rek,no_antrian_CS) => {
    try {
        const query = 'UPDATE users SET no_antrian_CS = $2 WHERE no_rek = $1 RETURNING *';
        const user = await db.query(query, [no_rek, no_antrian_CS]);
        return user.rows[0]; // Return the saved queuing information if needed
    } catch (error) {
        throw error;
    }
};

const getNextQueueNumberCS = async () => {
    try {
        const result = await db.query('SELECT MAX(no_antrian_CS) FROM users');
        const lastQueueNumber = result.rows[0].max || 0;
        return lastQueueNumber + 1;
    } catch (error) {
        throw error;
    }
};


module.exports = { getUserByUsernameOrEmail, createUser,saveToken, getUserByToken ,saveQueueInfo,saveNumberQueueTeller,getNextQueueNumberTeller,saveNumberQueueCS,getNextQueueNumberCS};
