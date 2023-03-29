const { app } = require(`${__dirname}/src/app.js`);
const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  console.log(`Listening on ${PORT}`);
});
