//required packages
const express = require("express");
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require("express-session");
var bodyParser = require('body-parser');


const app = express();
const pool = dbConnection();
const fetch = require('node-fetch');

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))//necessary for POST method

app.set('trust proxy', 1) // need to use sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//imported API options
const excerciseOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    'X-RapidAPI-Key': '86f4343f12msh6ed0dcfff1b9f30p1e6b85jsn0b4f07dac32a'
  }
};

const nutritionOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
    'X-RapidAPI-Key': '86f4343f12msh6ed0dcfff1b9f30p1e6b85jsn0b4f07dac32a'
  }
};

//global vars
var loggedUser; //currently logged in user ID
//var workoutPlanCount; //users current amount of workout plans

//middleware functions
function isAuthenticated(req, res, next){
  if(req.session.authenticated ){ //login protected
   next(); 
  }else{
    res.render('login')
  }
}

//website routes
var loggedUser;

app.get('/', async(req, res) => {
  
  res.render("login");
});

app.post('/checkLogin', async (req, res) => {
  let email = req.body.email; //email = 'test@gmail.com'
  let password = req.body.password; // password = 'secret'
  
  let passwordHash= "";
  
  let sql2= ` SELECT *
             FROM go_userinfo
             WHERE email = ?`;
  let params = [email];
  let rows2 = await executeSQL(sql2, params);
  
  if(rows2.length > 0){ // does email exist in our DB
    passwordHash = rows2[0].password;
  }

  const match = await bcrypt.compare(password, passwordHash);

  if(match){
    loggedUser = rows2[0].userId;
    //console.log("match test");
    req.session.authenticated = true;

     let sql = `SELECT * 
              FROM go_workout
              WHERE
                userId = ?`;
      let params = [loggedUser];
      let rows = await executeSQL(sql, params);
      
      let monPlan= exStringToList(rows[0].monday); 
      let tuesPlan= exStringToList(rows[0].tuesday); 
      let wedsPlan= exStringToList(rows[0].wednesday);
      let thursPlan= exStringToList(rows[0].thursday);
      let friPlan= exStringToList(rows[0].friday);
      let satPlan= exStringToList(rows[0].saturday);
      let sunPlan= exStringToList(rows[0].sunday);
      
      
      let monFullPlan= []; // empty jsons
      let tuesFullPlan= []; 
      let wedsFullPlan= [];
      let thursFullPlan= [];
      let friFullPlan= [];
      let satFullPlan= [];
      let sunFullPlan= [];
      
        if(typeof monPlan != "undefined"){
          ////for Loop for monday's plan exercises
         for(let i =0; i < monPlan.length; i++){ 
            
             let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${monPlan[i]}`; 
             let response = await fetch(url, excerciseOptions);
             let data = await response.json();
            monFullPlan = monFullPlan.concat(data); //concat jsons
          }
          console.log(monFullPlan);
      }
      
      if(typeof tuesPlan != "undefined"){
          for(let i =0; i < tuesPlan.length; i++){ 
             let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${tuesPlan[i]}`; 
             let response = await fetch(url, excerciseOptions);
             let data = await response.json();
            tuesFullPlan = tuesFullPlan.concat(data); //concat jsons
          }
          console.log(tuesFullPlan);
      }
      
      if(typeof wedsPlan != "undefined"){
          for(let i =0; i < wedsPlan.length; i++){ 
             let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${wedsPlan[i]}`; 
             let response = await fetch(url, excerciseOptions);
             let data = await response.json();
            wedsFullPlan = wedsFullPlan.concat(data); //concat jsons
          }
          console.log(wedsFullPlan);
      }
    
      if(typeof thursPlan != "undefined"){
          for(let i =0; i < thursPlan.length; i++){ 
             let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${thursPlan[i]}`; 
             let response = await fetch(url, excerciseOptions);
             let data = await response.json();
            thursFullPlan = wedsFullPlan.concat(data); //concat jsons
          }
          console.log(thursFullPlan);
      }
    
      if(typeof friPlan != "undefined"){
          for(let i =0; i < friPlan.length; i++){ 
             let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${friPlan[i]}`; 
             let response = await fetch(url, excerciseOptions);
             let data = await response.json();
            friFullPlan = friFullPlan.concat(data); //concat jsons
          }
          console.log(friFullPlan);
      }
    
      if(typeof satPlan != "undefined"){
          for(let i =0; i < satPlan.length; i++){ 
             let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${satPlan[i]}`; 
             let response = await fetch(url, excerciseOptions);
             let data = await response.json();
            satFullPlan = satFullPlan.concat(data); //concat jsons
          }
          console.log(satFullPlan);
      }
    
      if(typeof sunPlan != "undefined"){
          for(let i =0; i < sunPlan.length; i++){ 
             let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${sunPlan[i]}`; 
             let response = await fetch(url, excerciseOptions);
             let data = await response.json();
            sunFullPlan = sunFullPlan.concat(data); //concat jsons
          }
          console.log(sunFullPlan);
      }
    
    // console.log("test login");
    res.render("home", {"monPlan": monFullPlan, "tuesPlan": tuesFullPlan, "wedsPlan": wedsFullPlan, "thursPlan": thursFullPlan, "friPlan": friFullPlan, "satPlan": satFullPlan, "sunPlan": sunFullPlan});
  }else{
      res.render('login'/*,{"error":"Wrong Crendtials"}*/);
  }

});

app.post('/checkSignUp', async (req, res) => {  // add ability to hash password using bcrypt
  let email = req.body.email; 
  let password = req.body.password;

   let sql= `SELECT *
             FROM go_userinfo
             WHERE 
              email = ?`;
  let params = [email];
  let rows = await executeSQL(sql, params);
  
  if(rows.length > 0){
    alert('You have already made an account, please select login button instead');
    res.render("login");
  } else {
    const saltRounds = 10;
    let passwordHash = await bcrypt.hash(password, saltRounds);
    
    let sql2= `INSERT INTO go_userinfo (email, password)
              VALUES (?, ?)`;
    let params2 = [email, passwordHash];
    await executeSQL(sql2, params2);

     let sqlUserInfo = `SELECT *
             FROM go_userinfo
             WHERE 
              email = ?`;
     let paramsEmail = [email];
     let rows2= await executeSQL(sqlUserInfo, paramsEmail);
    
    let sqlGoGen= `INSERT INTO go_gen (userId)
                  VALUES (?)`;
    
    let rows3 = await executeSQL(sqlGoGen, rows2[0].userId);

    let sqlGoWorkout= `INSERT INTO go_workout (userId)
                  VALUES (?)`;
    
    let rows4 = await executeSQL(sqlGoWorkout, rows2[0].userId);
    
    loggedUser = rows2[0].userId;
    req.session.authenticated = true;
    
    res.render("home", {"info": rows2});
  }
  
});

app.get('/logout', (req, res) => {
   req.session.destroy();
   res.redirect('/');
});

app.get('/profile', isAuthenticated, async (req, res) => {
  let sql = `SELECT *
            FROM go_userinfo
            WHERE userId = ?`;
  let params = [loggedUser]
  let rows = await executeSQL(sql,params);

  res.render('profile',{"userInfo":rows});
});

app.post('/profile', isAuthenticated, async (req, res) => {
  let fname = req.body.fname;
  let lname = req.body.lname;
  let age = req.body.age;
  let weight = req.body.weight;
  let height = req.body.height;
  let email = req.body.email;
  let oldPWord = req.body.oldPWord;
  let newPWord = req.body.newPWord;
  console.log(newPWord);

  let sql = `UPDATE go_userinfo
            SET 
              fname = ?,
              lname = ?, 
              age = ?,
              weight = ?,
              height = ?
            WHERE
              userId = ?`;
  let params = [fname,lname,age,weight,height,loggedUser]
  await executeSQL(sql, params);

  sql = `SELECT *
        FROM go_userinfo
        WHERE userId = ?`;
  params = [loggedUser];
  let rows = await executeSQL(sql, params);
  
  const match = await bcrypt.compare(oldPWord, rows[0].password);
  if (rows[0].email != email && !(!email.match(/\S/))) {
    console.log('updating email');
    if (match) {
      sql = `UPDATE go_userinfo
              SET 
                email = ?
              WHERE
                userId = ?`;
      params = [email,loggedUser];
      await executeSQL(sql, params);
    } else {
      alert("Unable to update email. Password incorrect");
    }
  }

  console.log(newPWord.match(/\S/));
  if (newPWord.match(/\S/)) {
    console.log('updating pword');
    if (match) {
      sql = `UPDATE go_userinfo
              SET 
                password = ?
              WHERE
                userId = ?`;
      let passHash = await bcrypt.hash(newPWord, 10)
      console.log(passHash);
      params = [passHash,loggedUser];
      await executeSQL(sql, params);
    } else {
      alert("Unable to update password. Password incorrect");
    }
  }

  sql = `SELECT *
            FROM go_userinfo
            WHERE userId = ?`;
  params = [loggedUser]
  rows = await executeSQL(sql,params);
  
  res.render('profile',{"userInfo":rows});
});

app.get('/home', isAuthenticated, async (req, res) => {
  let sql = `SELECT * 
              FROM go_workout
              WHERE
                userId = ?`;
  let params = [loggedUser];
  let rows = await executeSQL(sql, params);
  
  let monPlan= exStringToList(rows[0].monday); 
  let tuesPlan= exStringToList(rows[0].tuesday); 
  let wedsPlan= exStringToList(rows[0].wednesday);
  let thursPlan= exStringToList(rows[0].thursday);
  let friPlan= exStringToList(rows[0].friday);
  let satPlan= exStringToList(rows[0].saturday);
  let sunPlan= exStringToList(rows[0].sunday);
  
  
  let monFullPlan= []; // empty jsons
  let tuesFullPlan= []; 
  let wedsFullPlan= [];
  let thursFullPlan= [];
  let friFullPlan= [];
  let satFullPlan= [];
  let sunFullPlan= [];
  
    if(typeof monPlan != "undefined"){
      ////for Loop for monday's plan exercises
     for(let i =0; i < monPlan.length; i++){ 
         let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${monPlan[i]}`; 
         let response = await fetch(url, excerciseOptions);
         let data = await response.json();
        monFullPlan = monFullPlan.concat(data); //concat jsons
      }
      console.log(monFullPlan);
  }
  
  if(typeof tuesPlan != "undefined"){
      for(let i =0; i < tuesPlan.length; i++){ 
         let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${tuesPlan[i]}`; 
         let response = await fetch(url, excerciseOptions);
         let data = await response.json();
        tuesFullPlan = tuesFullPlan.concat(data); //concat jsons
      }
      console.log(tuesFullPlan);
  }
  
  if(typeof wedsPlan != "undefined"){
      for(let i =0; i < wedsPlan.length; i++){ 
         let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${wedsPlan[i]}`; 
         let response = await fetch(url, excerciseOptions);
         let data = await response.json();
        wedsFullPlan = wedsFullPlan.concat(data); //concat jsons
      }
      console.log(wedsFullPlan);
  }

  if(typeof thursPlan != "undefined"){
      for(let i =0; i < thursPlan.length; i++){ 
         let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${thursPlan[i]}`; 
         let response = await fetch(url, excerciseOptions);
         let data = await response.json();
        thursFullPlan = thursFullPlan.concat(data); //concat jsons
      }
      console.log(thursFullPlan);
  }

  if(typeof friPlan != "undefined"){
      for(let i =0; i < friPlan.length; i++){ 
         let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${friPlan[i]}`; 
         let response = await fetch(url, excerciseOptions);
         let data = await response.json();
        friFullPlan = friFullPlan.concat(data); //concat jsons
      }
      console.log(friFullPlan);
  }

  if(typeof satPlan != "undefined"){
      for(let i =0; i < satPlan.length; i++){ 
         let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${satPlan[i]}`; 
         let response = await fetch(url, excerciseOptions);
         let data = await response.json();
        satFullPlan = satFullPlan.concat(data); //concat jsons
      }
      console.log(satFullPlan);
  }

  if(typeof sunPlan != "undefined"){
      for(let i =0; i < sunPlan.length; i++){ 
         let url = `https://exercisedb.p.rapidapi.com/exercises/exercise/${sunPlan[i]}`; 
         let response = await fetch(url, excerciseOptions);
         let data = await response.json();
        sunFullPlan = sunFullPlan.concat(data); //concat jsons
      }
      console.log(sunFullPlan);
  }
  
      res.render("home", {"monPlan": monFullPlan, "tuesPlan": tuesFullPlan, "wedsPlan": wedsFullPlan, "thursPlan": thursFullPlan, "friPlan": friFullPlan, "satPlan": satFullPlan, "sunPlan": sunFullPlan});
//think about adding for loop for each day of the week. then send to home multiple json's instead of one. duplicate loops in home view as well
  
});

app.get('/create', isAuthenticated, async(req, res) => {
  let url = `https://exercisedb.p.rapidapi.com/exercises/bodyPartList`;
  let response = await fetch(url, excerciseOptions);
  let data = await response.json();

  res.render("create", {"bodyparts": data});
});


app.get('/api/create/:bodypart', isAuthenticated, async(req, res) => {
  let bodypart = req.params.bodypart;
  //josue - changing the end url to check if bodyPartType works instead
  let url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodypart}`;
  let response = await fetch(url, excerciseOptions);
  let dataExercise = await response.json(); 
  
  //console.log(dataExercise);
  res.send(dataExercise);
  
});

app.get('/api/addToPlan/:day/:workoutId', isAuthenticated, async(req, res) => {
  let workoutId = req.params.workoutId;
  let day = req.params.day;
  console.log(day, workoutId);

   let sql= `SELECT ${day}
             FROM go_workout
             WHERE 
              userId = ? `;
  let params = [loggedUser];
  let rows = await executeSQL(sql, params);
  
  let prevPlan= "";
  
  switch(day){
      case 'monday':
       prevPlan = rows[0].monday; //weird and confusing since we don't have a 'day' column
        break;
      case 'tuesday':
       prevPlan = rows[0].tuesday;
         break;
      case 'wednesday':
       prevPlan = rows[0].wednesday;
        break;
      case 'thursday':
         prevPlan = rows[0].thursday;
        break;
      case 'friday':
       prevPlan = rows[0].friday;
        break;
      case 'saturday':
       prevPlan = rows[0].saturday;
        break;
      case 'sunday':
       prevPlan = rows[0].sunday;
        break;
  }
  
  let newPlan = addExString(prevPlan, workoutId);  
  
  console.log(newPlan);
  
  let insert = `UPDATE go_workout
                SET ${day} = ?
                WHERE userId = ?`;
  let params2 = [newPlan, loggedUser]; //loggedUser should be defined when siging in 
  let rows2 = await executeSQL(insert, params2);
  
});

app.get('/api/removeFromPlan/:day/:workoutId', isAuthenticated, async(req, res) => {
  let workoutId = req.params.workoutId;
  let day = req.params.day;
  console.log(day, workoutId);

   let sql= `SELECT ${day}
             FROM go_workout
             WHERE 
              userId = ? `;
  let params = [loggedUser];
  let rows = await executeSQL(sql, params);
  
  let prevPlan= "";
  
  switch(day){
      case 'monday':
       prevPlan = rows[0].monday; //weird and confusing since we don't have a 'day' column
        break;
      case 'tuesday':
       prevPlan = rows[0].tuesday;
         break;
      case 'wednesday':
       prevPlan = rows[0].wednesday;
        break;
      case 'thursday':
         prevPlan = rows[0].thursday;
        break;
      case 'friday':
       prevPlan = rows[0].friday;
        break;
      case 'saturday':
       prevPlan = rows[0].saturday;
        break;
      case 'sunday':
       prevPlan = rows[0].sunday;
        break;
  }
  workoutId = addExString("",workoutId);
  console.log(workoutId);
  let newPlan = prevPlan.replace(workoutId, '');
  
  console.log(newPlan);
  
  let insert = `UPDATE go_workout
                SET ${day} = ?
                WHERE userId = ?`;
  let params2 = [newPlan, loggedUser]; //loggedUser should be defined when siging in 
  let rows2 = await executeSQL(insert, params2);
  
});

app.get('/nutrition', isAuthenticated, async(req, res) => {

  res.render("nutrition");
});

app.post('/nutrition', isAuthenticated, async(req, res) => {
  
  let userProtein = req.body.proteinChoice;
  console.log(userProtein);
  if(userProtein == "undefined"){
   res.render("nutrition");
  }else{
     let url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?minProtein=${userProtein}`;
    let response = await fetch(url, nutritionOptions);
    let data = await response.json();
    console.log(data);
    res.render("nutrition",{"nutrition": data});
  }
});



//////////////////Workout Gen Stuff//////////////////
app.get('/wGen', isAuthenticated, async (req, res) => { 
  let url = `https://exercisedb.p.rapidapi.com/exercises/bodyPartList`;
  let response = await fetch(url, excerciseOptions);
  let data = await response.json();
  
  let wCount = req.query.wCount;
  let day = req.query.days;
  console.log(day);
  if (wCount != undefined) {
    let insert = `UPDATE go_gen
                  SET workoutCount = ?, day = ?
                  WHERE userId = ?`;
    let params = [wCount, day, loggedUser];
    await executeSQL(insert, params);
    res.render('wGen2', {"wCount": wCount, 'bodyparts': data});
  } else {
    res.render('wGen', {"wCount": wCount});
  }
});

app.get('/wGen2', isAuthenticated, async (req, res) => {
  let url = `https://exercisedb.p.rapidapi.com/exercises/bodyPartList`;
  let response = await fetch(url, excerciseOptions);
  let data = await response.json();
  
  let getCount = `SELECT workoutCount, day
                 FROM go_gen
                 WHERE userId = ?`
  let rows = await executeSQL(getCount, loggedUser);
  let wCount = rows[0].workoutCount;
  let day = rows[0].day;
  res.render("wGen2", {"wCount": wCount, 'bodyparts': data});
});

app.post('/wGen2', isAuthenticated, async (req, res) => {
  let url = `https://exercisedb.p.rapidapi.com/exercises/bodyPartList`;
  let response = await fetch(url, excerciseOptions);
  let data = await response.json();
  
  let getCount = `SELECT workoutCount, day
                 FROM go_gen
                 WHERE userId = ?`
  let rows = await executeSQL(getCount, loggedUser);
  let wCount = rows[0].workoutCount;
  let day = rows[0].day;
  
  let dataExercise= [];
  let bps = [];
  for (let i=0; i < wCount; i++){
    bps[i] = req.body[`bodypart${i}`];
  }
  console.log(bps);
  
  for (let i=0; i < wCount; i++){
    console.log("BPS @ I: ", bps[i]);
    let url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bps[i]}`;
    let response = await fetch(url, excerciseOptions);
    let exercise = await response.json();
    let randomInt = Math.floor(Math.random() * exercise.length);//index for exercise
    console.log("Ex Random Int: ", exercise[randomInt]);
    dataExercise = dataExercise.concat([exercise[randomInt]]);
  }
  console.log(dataExercise);
  //res.send(dataExercise);
  res.render('wGen2', {'bps': bps, 'wCount': wCount, 'bodyparts': data, 'dataExercise': dataExercise, 'day': day})
});
////////////////End of Workout Gen Stuff////////////////

// functions
// let test = "123,321,12,1111,999,12,"
// console.log(parseExString(test));

function exStringToList(string){
  let exerciseList = [];
  let currentExercise = "";
  for (let i=0;i<string.length;i++) {
    if (string.charAt(i) == ',') {
      exerciseList.push(currentExercise);
      currentExercise = "";
    } else {
      currentExercise = currentExercise.concat(string.charAt(i));
    }
  }
  return exerciseList;
}

//console.log(addExString(test,1001))
function addExString(currentExStr,newExStr){
  if (newExStr<10) {
    result = currentExStr.concat("000",newExStr,",");
  } else if (newExStr<100) {
    result = currentExStr.concat("00",newExStr,",");
  } else if (newExStr<1000) {
    result = currentExStr.concat("0",newExStr,",");
  }else {
    result = currentExStr.concat(newExStr,",");
  }
  return result;
}


function removeExString(currentExStr,targetExStr) {
  exList = exStringToList(currentExStr);
  result = currentExStr;
  found = false;
  for (let i=0;i<exList.length;i++) {
    if (exList[i] == targetExStr) {
      result = exList.splice(i,1);
      found = true;
    }
  }
  if (found) {
    exListToString(exList)
  }
  return result;
}

function exListToString(exList) {
    result = "";
    for (let i=0;i<exList.length;i++) {
      result = result.concat(exList[i],",")
    }
}

async function executeSQL(sql, params){
  return new Promise (function (resolve, reject){
    pool.query(sql, params, function (err, rows, fields) {
    if (err) throw err;
      resolve(rows);
    });
  });
}//executeSQL

//values in red must be updated
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 10,
      host: "acw2033ndw0at1t7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "x0idldwaexyihfwn",
      password: "zmkd5qzs1o9hbgfn",
      database: "v6ekccjvfjcs4b0z"

   }); 

   return pool;

} //dbConnection

//start server
app.listen(3000, () => {
  console.log("Expresss server running...")
})





