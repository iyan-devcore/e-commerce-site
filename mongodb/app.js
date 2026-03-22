import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db.js';
import router from './router/routes.js';
import productRoutes from './router/productRoutes.js';
import orderRoutes from './router/orderRoutes.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 5000;

app.get('/', (req, res) => {
  res.send('Hello World! from backend');
});

app.use("/api/user", router);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
