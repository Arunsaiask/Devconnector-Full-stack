const express = require("express")
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db")
const path = require('path');


const app = express()

//connect database 
connectDB();

//use middleware
app.use(express.json({extended:false}))



app.use("/api/user",require("./routes/api/user"))
app.use("/api/auth",require("./routes/api/auth"))
app.use("/api/profile",require("./routes/api/profile"))
app.use("/api/posts",require("./routes/api/posts"))


// serve static assests in production

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

  
app.listen(PORT,()=> console.log(`app listening at http://localhost:5000`))
