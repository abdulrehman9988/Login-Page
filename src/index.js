const express=require("express")
const path=require("path")
const bcrypt=require("bcrypt")
const collection=require("./config")

 
const app=express()

//this line will convert data into json format
app.use(express.json());


app.use(express.urlencoded({extended: false}));

// use EJS as the view engine
app.set("view engine", "ejs")

app.get("/",(req,res)=>{
    // res.render("login");
    res.render("home-layout");
})

app.get("/login",(req,res)=>{
  res.render("login");
})

app.get("/signup",(req,res)=>{
  res.render("signup");
})

//this part is for rejistration
app.post("/signup", async (req,res)=>{
    
  const data= {
    name: req.body.username,
    password: req.body.password
  }

  //it will check if user is already exist in the database
  const existingUser= await collection.findOne({name: data.name});
  if(existingUser){
    res.send(`<script>alert("Sorry this emailId is already exist. Please enter diffrent emailId to SignUp"); window.location.href="/signup";</script>`)
  }else{
    //this will conver over password to hash form that is for security purpose
    const saltRound=10;//Number of salt round for bcrypt
    const hashedPassword=await bcrypt.hash(data.password,saltRound);

    data.password = hashedPassword //it will replace the hash password with original password

    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
  return res.redirect("/")
})

//this part is for user login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user in the database
    const user = await collection.findOne({ name: username });

    // If user not found, show alert and redirect to login
    if (!user) {
      return res.send(`<script>
        alert("Username not found!");
        window.location.href="/";
      </script>`);
    }

    // Compare the hash passwords from the database with the plain text
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If password is incorrect, show alert and redirect to login
    if (!isPasswordMatch) {
      return res.send(`<script>
        alert("Wrong password!");
        window.location.href="/";
      </script>`);
    }

    // If login successful, redirect to home page
    res.render("home");

  } catch (error) {
    console.error("Login error:", error);
    res.send(`<script>
      alert("An error occurred. Please try again!");
      window.location.href="/";
    </script>`);
  }
});










const port=5000;
app.listen(port,()=>{
  console.log(`server running on Port: ${port}`);
  
})