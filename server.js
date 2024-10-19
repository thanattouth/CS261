const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Use process.env to access environment variables
const API_KEY = process.env.TU_API_KEY;

app.post('/api/login', async (req, res) => {
    const { UserName, PassWord } = req.body;
    
    console.log('Received login request for:', UserName);
    
    if (!API_KEY) {
        console.error('API_KEY is not set');
        return res.status(500).json({
            success: false,
            message: 'Server configuration error: API_KEY is not set'
        });
    }

    try {
        console.log('Sending request to TU API...');
        const response = await axios.post('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
            UserName,
            PassWord
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Application-Key': API_KEY
            }
        });
        
        console.log('Received response from TU API:', response.status);
        const data = response.data;
        
        if (data.status) {
            res.json({
                success: true,
                message: data.message,
                userData: data
            });
        } else {
            res.json({
                success: false,
                message: data.message
            });
        }
    } catch (error) {
        console.error('Detailed error:', error);
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request.',
            error: error.response ? error.response.data : error.message
        });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));