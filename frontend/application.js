const express = require("express");
const conversionController = require("./src/controllers/conversion2.js");
const poConversionController = require("./src/controllers/conversion.js");
const cors = require("cors");
const axios = require("axios");

const DEFAULT_PORT = 3000;
class Application {
  static async main() {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.set("view engine", "ejs");
    app.use("/conversion", conversionController);
    app.use("/poconversion", poConversionController);

    app.get("/", (req, res) => {
      res.render("index", {
        invoiceNo: "",
        buyerPO: "",
        date: "",
        exchangeRate: "",
        totalAmount: "",
      });
    });

    app.get("/po", async (req, res) => {
      try {
        const distributorsResponse = await axios.get("http://localhost:3001/api/distributors");
        const logisticsResponse = await axios.get("http://localhost:3001/api/logistics");

        const distributors = distributorsResponse.data;
        const logistics = logisticsResponse.data;
        res.render("po", {
          logistic: logistics,
          distributor: distributors,
          invoiceNo: "",
          date: "",
          totalAmount: "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
      }
    });

     // Function to start server
     const startServer = (port) => {
      app.listen(port, () => {
        console.log(`Application listening on port ${port}`);
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`Port ${port} is already in use.`);
        } else {
          console.error(`Error occurred: ${err.message}`);
        }
      });
    };
     // Try to start the server on the default port
     startServer(DEFAULT_PORT);
  }
}

module.exports = Application;

Application.main();
