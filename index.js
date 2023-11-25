import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

const app = express();

//middlwares
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//database
mongoose.connect("mongodb://localhost:27017", {
    dbName: "backend",
    })
    .then(() => console.log("database connected"))
    .catch((err) => console.log(err.message));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const User = mongoose.model("User",userSchema)



const isAuthenticated = (req,res,next) => {
    const token = req.cookies.token;
    if (token) {
        next();
    } else {
      res.render("login.ejs");
    }
}

app.get("/",isAuthenticated ,(req, res) => {
  res.render("logout.ejs")
});

app.post("/login", async(req, res) => {
    const { name, email } = req.body;
    const user = await User.create({
        name, email,
    })
  res.cookie("token", user.__id, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});



// app.get('/success', (req, res) => {
//     res.render("success.ejs");
// })

// app.post('/', async (req, res) => {
//     const { name, email } = req.body; 
//     await message.create({ name,email })
//     res.redirect("/success");
// })


app.listen(4400, () => {
    console.log("server is listening on port 4400");
});