const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const compression = require("compression");
const morgan = require("morgan");
const config = require("./configs");
const routes = require("./routes");
const errors = require("./middlewares/errors");

// Initialize App
const app = express();

// Middlewares
app.use(helmet());
app.use(xss());
app.use(compression());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", routes);
app.use(errors);

// Running Server
app.listen(config.port, () => {
	console.log(`\n🚀 [Express] -> Server running on port ${config.port}\n`);
});
