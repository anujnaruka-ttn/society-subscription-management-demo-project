import express from 'express';
import { ENV } from './validations/env.validation.ts';
import { query } from './config/db.ts';

const app = express();
app.use(express.json());

const PORT = ENV.PORT;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const textQuery = `SELECT NOW()`;

query(textQuery)
    .then(
        (result) => console.log('Successful query execution: ' + result.rows[0].now)
    ).catch(
        (err: Error) => console.error('Query Failed : ' + err.message)
    )

app.get('/', (_req, res) => {
    res.json({
        message: "Society Subscription Management API is Live!",
        status: "Healthy"
    });
});