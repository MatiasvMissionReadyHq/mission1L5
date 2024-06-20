    // index.js
    const express = require('express');
    const multer = require('multer');
    const cors = require('cors');
    const axios = require('axios');
    const fs = require('fs');
    require('dotenv').config();
    // const bodyParser = require('body-parser');
    
    
    const app = express();
    app.use(cors());
    
    // Set up middleware
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: true }));
    
    const upload = multer({ storage: multer.memoryStorage() });
    
    async function predictImage(imageFilePath, predictionKey, endpoint, projectId, iterationName) {
        try {
            const url = `${endpoint}/customvision/v3.0/Prediction/${projectId}/classify/iterations/${iterationName}/image`;
            const headers = {
            'Content-Type': 'application/octet-stream',
            'Prediction-Key': predictionKey
            };
    
            const imageData = fs.readFileSync(imageFilePath);
    
            const response = await axios.post(url, imageData, { headers });
            return response.data.predictions;
        } catch (error) {
            console.error('Prediction failed:', error.message);
            return null;
        }
    }
    
        const imageFilePath = '/Users/qo/Desktop/image24.png';
        const predictionKey = process.env.SUBSCRIPTION_KEY;
        const endpoint = process.env.ENDPOINT;
        const projectId = '4b39a3dc-2e22-4d7b-adf2-5b3419376fc0';
        const iterationName = 'Iteration1';
    
        
    
    app.post('/upload', upload.single('file'), async (req, res) => {
    
        const imageUrl = req.file.buffer;
        console.log(req.file);
        const imageFilePath = `/Users/qo/Desktop/image24.png`;
    
        predictImage(imageFilePath, predictionKey, endpoint, projectId, iterationName)
        .then(predictions => {
            if (predictions) {
    
                return res.status(200).json(predictions);
            } else {
                console.log('No predictions available.');
            }
        })
        .catch(err => {
            console.error('Prediction error:', err);
        });
        
    });    
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    