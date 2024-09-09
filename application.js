const express = require("express");
const conversionController = require("./src/controllers/conversion2.js");
const poConversionController = require("./src/controllers/conversion.js");
const cors = require("cors");
const mongoose = require('mongoose');
const distributor = require("./schema/distributor.js");
const logistic = require('./schema/logistics.js');
const distributorRouter = require('./router/distributorRouter');
const axios = require('axios');

const uri = 'mongodb+srv://goron21621:ITD3fZdFF8gB9Up4@itrade.tvog6.mongodb.net/?retryWrites=true&w=majority&appName=iTrade';

const password = "ITD3fZdFF8gB9Up4"
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
}).catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error);
});

const DEFAULT_PORT = 3000;

class Application {
  static async main() {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.set('view engine', 'ejs');
    app.use("/conversion", conversionController);
    app.use("/poconversion", poConversionController);
    app.use('/api', distributorRouter);

    app.get("/", (req, res) => {
      res.render('index', {
        invoiceNo: "",
        buyerPO: "",
        date: "",
        exchangeRate: "",
        totalAmount: "",
      });
    });

    app.get("/po", async (req, res) => {
      try {
        const distributorsResponse = await axios.get('https://invoice-generator-opq6.onrender.com/api/distributors');
        const logisticsResponse = await axios.get('https://invoice-generator-opq6.onrender.com/api/logistics');

        const distributors = distributorsResponse.data;
        const logistics = logisticsResponse.data;
        res.render('po', {
          logistic: logistics,
          distributor: distributors,
          invoiceNo: "",
          date: "",
          totalAmount: "",
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
      }
    });

    app.listen(process.env.PORT || DEFAULT_PORT, () => {
      console.log(`Application listening on port ${process.env.PORT || DEFAULT_PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${DEFAULT_PORT} is already in use, trying another port...`);
        app.listen(DEFAULT_PORT + 1);
      }
    });
  }
}

module.exports = Application;

Application.main();
