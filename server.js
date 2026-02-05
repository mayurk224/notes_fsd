const dotenv = require('dotenv');
const connectDB = require("./config/database");
const app = require("./src/app");

dotenv.config();

app.listen(3000, () => {
    connectDB();
    console.log("Server is running on port 3000");
});