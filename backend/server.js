const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Set up multer for file uploads
const storage = multer.memoryStorage(); // just to Store files in memory
const upload = multer({ storage });


app.post('/upload', upload.single('file'), async (req, res) => {
    try {
            if (!req.file) {
                return res.status(400).send({ message: 'No file uploaded' });
            }

            // consoleLog the file buffer to make sure it's in memory
            console.log(req.file.mimetype);

            // Send the buffered image to Azure Custom Vision API but just check if its image before
            if(req.file.mimetype=="image/png" || req.file.mimetype=="image/jpeg" || req.file.mimetype=="image/jpg"){
                const azureResponse = await sendToAzureCustomVision(req.file.buffer);
                return res.status(200).json(azureResponse.predictions);
            }else{
                return res.status(400).send({ message: 'File type not supported' });
            }

        } catch (error) {
            res.status(400).send({ message: 'File upload failed', error });
        }
    });

const sendToAzureCustomVision = async (imageBuffer) => {

    const predictionKey = process.env.SUBSCRIPTION_KEY;
    const endpoint = process.env.ENDPOINT;
    const projectId = '4b39a3dc-2e22-4d7b-adf2-5b3419376fc0';
    const iterationName = 'Iteration6';

    try {
        const response = await axios.post(
            `${endpoint}/customvision/v3.0/Prediction/${projectId}/classify/iterations/${iterationName}/image`,
            imageBuffer,
            {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Prediction-Key': predictionKey
                }
            }
        );
        console.log('Azure Custom Vision response:', response.status);
        if(response.status==200){
            return response.data;
        }
        return res.status(400).send({ message: 'File upload failed', error });
        
    }catch (error) {
        console.error('Error sending image to Azure Custom Vision API:', error);
        throw error;
    }
};

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
