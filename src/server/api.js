const express = require('express');
const router = express.Router();
const emailService = require('./emailService');
const oscService = require('./oscService');  // Mover aquí
const fs = require('fs');
const path = require('path');


// Load email queue from JSON file
const queueFilePath = path.join(__dirname, '../..', 'data', 'queue.json');
const historyFilePath = path.join(__dirname, '../..', 'data', 'players-history.json');

// OSC endpoint - Mover aquí con los otros endpoints
router.post('/sendOSC', (req, res) => {
    const { address, message } = req.body;
    try {
        oscService.sendOSCMessage(address, message);
        console.log(`OSC message sent: ${address} - ${message}`);
        res.status(200).json({ message: 'OSC message sent' });
    } catch (error) {
        console.error('Error sending OSC:', error);
        res.status(500).json({ message: 'Error sending OSC message' });
    }
});


// Funciones de utilidad con debugging
function loadFile(filePath) {
    console.log(`Attempting to load file: ${filePath}`);
    if (fs.existsSync(filePath)) {
        console.log(`File exists: ${filePath}`);
        const data = fs.readFileSync(filePath);
        try {
            const parsed = JSON.parse(data);
            console.log(`File loaded successfully: ${filePath}`);
            return parsed;
        } catch (error) {
            console.error(`Error parsing JSON from ${filePath}:`, error);
            return [];
        }
    }
    console.log(`File does not exist: ${filePath}`);
    return [];
}

function saveFile(filePath, data) {
    console.log(`Attempting to save to file: ${filePath}`);
    console.log('Data to save:', JSON.stringify(data, null, 2));
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Save successful: ${filePath}`);
    } catch (error) {
        console.error(`Error saving to ${filePath}:`, error);
        throw error;
    }
}

// Endpoint savePlayerData
router.post('/savePlayerData', (req, res) => {
    try {
        console.log('Received savePlayerData request:', req.body);
        const { playerName, email, age, nikeUsage, interests, challengeResults } = req.body;

        // Crear registro con timestamp
        const playerRecord = {
            timestamp: new Date().toISOString(),
            playerData: {
                playerName,
                email,
                age,
                nikeUsage,
                interests
            },
            challengeResults,
        };
        
        // Cargar y actualizar historial
        const history = loadFile(historyFilePath);
        history.push(playerRecord);
        saveFile(historyFilePath, history);

        console.log(`Successfully saved data for player: ${playerName}`);
        res.status(200).send({ message: 'Player data saved successfully.' });
    } catch (error) {
        console.error('Error in savePlayerData:', error);
        res.status(500).send({ message: 'Error saving player data.' });
    }
});

// Endpoint to send email
router.post('/sendEmail', (req, res) => {
    console.log('Received sendEmail request:', req.body);
    const { email, subject, message } = req.body;

    emailService.sendEmail(email, subject, message)
        .then(() => {
            console.log(`Email sent successfully to: ${email}`);
            res.status(200).send({ message: 'Email sent successfully.' });
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            // Cargar la cola existente antes de agregar el nuevo email
            const queue = loadFile(queueFilePath) || [];
            // Agregar el nuevo email a la cola existente
            queue.push({ 
                email, 
                subject, 
                message, 
                timestamp: new Date().toISOString() 
            });
            // Guardar la cola actualizada
            saveFile(queueFilePath, queue);
            console.log(`Email queued for later sending to: ${email}`);
            res.status(500).send({ message: 'Email failed to send, queued for later.' });
        });
});

// Process email queue endpoint
router.post('/processQueue', async (req, res) => {
    try {
        console.log('Processing email queue...');
        const queue = loadFile(queueFilePath);
        
        if (!queue || queue.length === 0) {
            console.log('No emails in queue');
            return res.status(200).json({ message: 'No emails in queue' });
        }

        console.log(`Found ${queue.length} emails in queue`);
        const successfulEmails = [];
        const failedEmails = [];

        // Procesar todos los emails en la cola
        for (const email of queue) {
            try {
                console.log(`Attempting to send email to: ${email.email}`);
                await emailService.sendEmail(email.email, email.subject, email.message);
                successfulEmails.push(email);
                console.log(`Successfully sent email to: ${email.email}`);
            } catch (error) {
                console.error(`Failed to send email to: ${email.email}`, error);
                failedEmails.push(email);
            }
            // Pequeña pausa entre envíos para evitar sobrecarga
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Guardar solo los emails que fallaron
        if (failedEmails.length > 0) {
            console.log(`Saving ${failedEmails.length} failed emails back to queue`);
            saveFile(queueFilePath, failedEmails);
        } else {
            // Si no hay emails fallidos, guardar un array vacío
            console.log('Queue empty - all emails sent successfully');
            saveFile(queueFilePath, []);
        }

        const response = {
            message: `Processed ${successfulEmails.length} emails, ${failedEmails.length} failed`,
            successful: successfulEmails.length,
            failed: failedEmails.length
        };
        console.log('Queue processing complete:', response);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error processing queue:', error);
        res.status(500).json({ message: 'Error processing queue' });
    }
});

// Get player history endpoint
router.get('/player-history', (req, res) => {
    try {
        console.log('Fetching player history...');
        const history = loadFile(historyFilePath);
        console.log(`Found ${history.length} history records`);
        res.status(200).json(history);
    } catch (error) {
        console.error('Error loading history:', error);
        res.status(500).json({ message: 'Error loading player history' });
    }
});

module.exports = router;



