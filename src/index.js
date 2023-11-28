const { app, PORT } = require("./server");

app.listen(PORT, ()=> {
    console.log('The server is running on port: ' + PORT);
})