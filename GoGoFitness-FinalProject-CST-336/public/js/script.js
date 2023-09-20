document.querySelector("#showWorkouts").addEventListener("click", showWorkouts);

/*let workoutLinks = document.querySelectorAll("a");
for (let i=0; i < workoutLinks.length; i++ ) {
 workoutLinks[i].addEventListener("click",addToPlan);
}*/

async function showWorkouts(){ // NEEED to fix -joshua Should display workouts based on user's selection in the create page dropdown
  let bodypart = document.querySelector("#bodypart").value; //should be value from drop down selection
  
  let day = document.querySelector("#days").value;
  
   let url = `/api/create/${bodypart}`;
   let response = await fetch(url);
   let data = await response.json();
   console.log(data);
   
   document.querySelector("#workouts").innerHTML =""; 
   
  for (let i = 5; i < 13; i++) {    
    document.querySelector("#workouts").innerHTML += `
      <div class="card card-body col-sm bg-secondary text-light" style="width: 18rem;">
      <img src="${data[i].gifUrl}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${data[i].name}</h5> 
        <p class="card-text">${data[i].bodyPart} ${data[i].equipment}</p>
        <a href="#" onclick="addToPlan(${data[i].id})" class="btn btn-warning">Add To Plan</a>
      </div>
    </div>` ;
  }
}

async function addToPlan(workoutId){ 
   let day = document.querySelector("#days").value;//NEEEDS to be neew argument passed in 
  
   let url = `/api/addToPlan/${day}/${workoutId}`;
   let response = await fetch(url);
   let data = await response.json();
   console.log(data);
}

async function addFromGen(workoutId, day){ 
  
   let url = `/api/addToPlan/${day}/${workoutId}`;
   let response = await fetch(url);
   let data = await response.json();
   console.log(data);
}

async function removeFromPlan(workoutId, day){ 
   console.log(day , workoutId);
   let url = `/api/removeFromPlan/${day}/${workoutId}`;
   let response = await fetch(url);
   let data = await response.json();
   
}

function refreshPage(){
  window.location.reload();
} 