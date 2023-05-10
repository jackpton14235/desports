import "./App.css";
import { MultiSwitch } from "./components/multi-switch";
import { useEffect, useState } from "react";
import { BetModal } from "./components/bet-modal";
import {
  getBalances,
  getBets,
  isWalletConnected,
  transfer,
} from "./logic/metamask";
import { testWeb3 } from "./logic/test";
import { getThisWeek } from "./sportAPI.js";
import savedGames from "./components/temp-data.json";
import { BigNumber } from "ethers";
import web3 from "web3";

const schedule = [
  {
    opponent0: "Chiefs",
    opponent1: "Packers",
    date: new Date(2023, 3, 2, 16, 0, 0),
    odds: 300,
  },
  {
    opponent0: "Nationals",
    opponent1: "Jets",
    date: new Date(2023, 3, 4, 16, 0, 0),
    odds: -200,
  },
  {
    opponent0: "Giants",
    opponent1: "49ers",
    date: new Date(2023, 3, 4, 19, 0, 0),
    odds: 1500,
  },
];

const myBets = [
  {
    opponent0: "Bengals",
    opponent1: "Texans",
    date: new Date(2023, 2, 29, 16, 0, 0),
    odds: 100,
    bet: 100,
    on: 1,
  },
  {
    opponent0: "Chiefs",
    opponent1: "Seahawks",
    date: new Date(2023, 229, 2, 20, 0, 0),
    odds: 450,
    bet: 200,
    on: 0,
  },
  {
    opponent0: "Vikings",
    opponent1: "Patriots",
    date: new Date(2023, 2, 27, 15, 0, 0),
    odds: -300,
    bet: 150,
    on: 1,
  },
];

function App() {
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState(undefined);
  const [games, setGames] = useState();
  const [account, setAccount] = useState();

  useEffect(() => {
    const account = isWalletConnected();
    getSavedGames();
    setAccount(account);
  }, []);

  function onBet(index, home) {
    setModal([index, home]);
  }

  // used for testing so we don't hit our request limit for api
  function getSavedGames() {
    const allGames = savedGames.reduce(
      (all, day) => [...all, ...day.response],
      []
    );
    // .map((_, i, arr) => arr[arr.length - i - 1]);
    console.log(allGames);
    setGames(allGames);
  }

  function getGames() {
    getThisWeek()
      .then((res) => {
        console.log(res);
        const allGames = res.reduce(
          (all, day) => [...all, ...day.response],
          []
        )
        .filter(game => game.timestamp * 1000 > Date.now())
        setGames(allGames);
        console.log(allGames);
      })
      .catch(console.error);
  }

  return (
    <div className="App">
      <h1>Sports Betting</h1>
      <br></br>
      <h3>Upcoming Games</h3>
      {modal && (
        <BetModal
          game={games[modal[0]]}
          home={modal[1]}
          close={() => setModal(undefined)}
        />
      )}
        <table className="bets-list">
          <tbody>
            {games?.map((game, i) => (
              <tr className="game-row" key={game.id}>
                <td style={{ textAlign: "left" }}>
                  <button onClick={() => onBet(i, true)}>Bet</button>
                  <img src={game.teams.home.logo} alt="" />
                  {game.teams.home.name}
                </td>
                <td style={{ textAlign: "center" }}>
                  {/* <p style={{ color: game.odds > 0 ? "green" : "red" }}>
                    {game.odds > 0 ? "+" + game.odds : game.odds}
                  </p> */}
                  {new Date(game.timestamp * 1000).toLocaleDateString()}
                  {"\u2022"}{" "}{game.id}{"\u2022"}{" "}
                  {new Date(game.timestamp * 1000).toLocaleTimeString()}
                </td>
                <td style={{ textAlign: "right" }}>
                  {game.teams.away.name}
                  <img src={game.teams.away.logo} alt="" />
                  <button onClick={() => onBet(i, false)}>Bet</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

export function getPayout(bet, homePool, awayPool, home) {
  try {
    if (bet === "") bet = "0";
    const betWei = web3.utils.toWei(bet);
    if (home) {
      return web3.utils.fromWei(
        awayPool.mul(betWei).div(homePool.add(betWei)).toString(),
        "ether"
      );
    } else {
      return web3.utils.fromWei(
        homePool.mul(betWei).div(awayPool.add(betWei)).toString(),
        "ether"
      );
    }
  } catch (ex) {
    return 0;
  }
}

export default App;
