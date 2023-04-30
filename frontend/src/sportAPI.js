// Constants
var myHeaders = new Headers();
var games = [];
var date = new Date();
let year;
let month;
let day;
myHeaders.append("x-rapidapi-key", "eefc3ede4e8d6b86b69a21dc267eb6cc");
myHeaders.append("x-rapidapi-host", "v1.baseball.api-sports.io");

for(let i = 0; i < 1; i++){
    year = date.getFullYear(); 
    month = String(date.getMonth()+1).padStart(2,"0");
    day = date.getDate() - i;
    day = String(day).padStart(2, '0');
    let currentDate = `${year}-${month}-${day}`;

    var myParameters = new URLSearchParams({
        date: currentDate,
        league: "1",
        season: "2023"
    });

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      
      fetch("https://v1.baseball.api-sports.io/games?" + myParameters, requestOptions)
        .then(response => response.text())
        .then(result => {
          var game = JSON.parse(result);
          games.push(game);
          console.log(game);
        })
        .catch(error => console.log('error', error));
}
