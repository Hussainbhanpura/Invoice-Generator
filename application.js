const express = require("express");
const conversionController = require("./src/controllers/conversion2.js");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

class Application {
  static async main() {
    const app = express();
    app.use(express.json());
    app.use(cors());

    // Use the already defined __dirname and __filename
    app.get("/", (req, res) => {
      const filePath = path.join(__dirname, "../invoice/index.html");
      res.sendFile(filePath);
    });

    app.use("/conversion", conversionController);

    app.listen(PORT, () => {
      console.log(`Application listening on port ${PORT}`);
    });
  }
}

module.exports = Application;
