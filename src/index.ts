import dotenv from 'dotenv';
dotenv.config();

import app from "./server";


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Job service running on http://localhost:${PORT}`);
});
