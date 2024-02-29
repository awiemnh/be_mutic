const express = require("express");
const cors = require("cors");
const mainRoutes = require("./src/routes/mainRoutes.js");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: 'Hello' });
});

const option = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Your API Documentation",
        version: "1.0.0",
        description: "Documentation for your API",
      },
    },
    apis: ["./src/routes/mainRoutes.js"],
};



// Use user routes
app.use("/api", mainRoutes);

const swaggerSpec = swaggerJSDoc(option);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
