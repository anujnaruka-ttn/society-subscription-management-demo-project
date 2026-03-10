import express from 'express';
import { ENV } from './validations/env.validation.js';

const app = express();
const PORT = ENV.PORT;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

