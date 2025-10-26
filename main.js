const express = require("express");
const cors = require("cors");
require("dotenv").config();
const taskRoutes = require("./routes/task.routes");
const userRouter = require("./routes/user.routes");

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Express server!</h1>");
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
