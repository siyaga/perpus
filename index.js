const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const booksRouter = require("./routes/books");
const membersRouter = require("./routes/members");



//import library CORS
const cors = require('cors')

//use cors
const options = {
    origin: 'http://localhost:3000',
}
app.use(cors(options))

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.get("/", (req, res) => {
    res.json({
        message: "ok"
    });
});


app.use(bodyParser.json());
app.use("/books", booksRouter);
app.use("/members", membersRouter);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({
        message: err.message
    });
    return;
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});