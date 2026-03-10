import express from 'express';
import type { Http2Server } from 'node:http2';
import { ENV } from './validations/env.validation.js';
const app = express();

const PORT = ENV.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});