require('dotenv').config();
require("./config/database").connect();
const jwt=require('jsonwebtoken')

const express=require("express")
const User=require("./model/user")
const auth = require("./middleware/auth");
const app=express();

app.use(express.json())

app.post("/welcome",auth,(req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });


// Login goes here
// Register

// ...

app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { fName, lName, email, password } = req.body;
  
      // Validate user input
      if (!(email && password && fName && lName)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
    //   encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        fName,
        lName,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        // password: encryptedPassword,
        password
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
      res.cookie("token", token, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "none",
                })
                .send();
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  


// Login



app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  

//   get data
app.get("/user",auth,async(req,res)=>{
	try{
		const getMens=await User.find()
		res.send(getMens);

	}catch(e){
		res.status(400).send(e);
	}

})


module.exports=app
