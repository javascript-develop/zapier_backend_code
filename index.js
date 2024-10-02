
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
app.use(bodyParser.json());

const PANDADOC_API_KEY = '4bc73c09b1eae36cfe5f3d884a53e924193c0094';

// Test route - "Hello World" to verify successful deployment
app.get('/', (req, res) => {
    res.send('Hello World! The server is successfully deployed.');
});

// Create PandaDoc Template API
app.post('/create-template', async (req, res) => {
    const { templateName, fields } = req.body;

    try {
        const response = await axios.post('https://api.pandadoc.com/public/v1/templates', {
            name: templateName,
            fields: fields
        }, {
            headers: {
                Authorization: `API-Key ${PANDADOC_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            status: 'success',
            templateId: response.data.id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating template in PandaDoc' });
    }
});

// Create PandaDoc Document API
app.post('/create-document', async (req, res) => {
    const { templateId, documentName, variables } = req.body;

    try {
        const response = await axios.post('https://api.pandadoc.com/public/v1/documents', {
            name: documentName,
            template_uuid: templateId,
            tokens: variables
        }, {
            headers: {
                Authorization: `API-Key ${PANDADOC_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            status: 'success',
            documentId: response.data.id,
            documentUrl: response.data.url,
            documentStatus: response.data.status
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating document in PandaDoc' });
    }
});

// Get port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen on the provided port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
