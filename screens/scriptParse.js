const fs = require('fs');
obj = {}
filePath = "../assets/data/exercises.json"
var file = JSON.parse(fs.readFileSync(filePath));

for(item of file){
  if(obj[item['muscleGroup']] != undefined){
      if(!obj[item['muscleGroup']].some( muscle=> muscle['name'] === item['name'] )){
        obj[item['muscleGroup']].push({'name': item['name']})  
      }
  }
  else{
       obj[item['muscleGroup']] = [ {'name': item['name']} ]
  }
}

var jsonContent = JSON.stringify(obj);
 
fs.writeFile("../assets/data/exercisesV2.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});