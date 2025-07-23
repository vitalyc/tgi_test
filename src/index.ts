import dotenv from 'dotenv';
dotenv.config();

import app from "./server";
import logger from "./logger";


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Job service running on http://localhost:${PORT}`);
});
