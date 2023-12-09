require("dotenv").config();
const createServer = require("../helpers/createServer");
const PORT = process.env.PORT;

const app = createServer();

app.listen(PORT, () => {
  console.info(`App listening on port ${PORT}`);
});
