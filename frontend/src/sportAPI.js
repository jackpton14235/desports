export function getThisWeek() {
  // Constants
  const ms_per_day = 86_400_000;
  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "eefc3ede4e8d6b86b69a21dc267eb6cc");
  myHeaders.append("x-rapidapi-host", "v1.baseball.api-sports.io");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // get datetimes for last 7 days
  const now = Date.now();
  const dates = new Array(7).fill(0).map((_, i) => new Date(now + i * ms_per_day));

  // get list of requests for each day
  const requests = dates.map((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let currentDate = `${year}-${month}-${day}`;
    const params = new URLSearchParams({
      date: currentDate,
      league: "1",
      season: "2023",
    });
    return fetch(
      "https://v1.baseball.api-sports.io/games?" + params,
      requestOptions
    );
  });

  // get all requests concurrently
  Promise.all(requests)
    .then((results) => {
      console.log(results);
      return results;
    })
    .catch((err) => console.error(err));
}
