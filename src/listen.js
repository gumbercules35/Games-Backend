const { app } = require(`${__dirname}/app.js`);

app.listen(9090, (err) => {
  if (err) {
    console.log(err);
  } else console.log("Listening on 9090");
});
