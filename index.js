require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const sensorRoutes = require('./routes/sensorRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
connectDB();

app.use('/api', sensorRoutes);
app.use('/user', userRoutes);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});

const sensor  = require('./models/sensorModel');
const verifyToken = require('./middleware/verifyToken');

let statusPlant = false;
let timer;
app.get('/kondisiPlant', verifyToken,(req, res) => {
    res.status(200).json({ status: statusPlant });
});

const dataChangeStream = sensor.watch();

dataChangeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
        statusPlant = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
            statusPlant = false;
        }, 10000); 
    }
}
);
