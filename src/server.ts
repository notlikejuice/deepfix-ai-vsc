import express from 'express';
import { DeepSeekClient } from './api/deepseek';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/deepseek', async (req, res) => {
    try {
        const response = await DeepSeekClient.getInstance().sendRequest(req.body.prompt);
        res.json({ response });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});