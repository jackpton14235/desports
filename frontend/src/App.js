import logo from "./logo.svg";
import "./App.css";
import { MultiSwitch } from "./components/multi-switch";
import { useEffect, useState } from "react";
import { BetModal } from "./components/bet-modal";
import { isWalletConnected } from "./logic/metamask";
import { testWeb3 } from "./logic/test";

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
  const [account, setAccount] = useState();

  useEffect(() => {
    const account = isWalletConnected();
    setAccount(account);
  }, []);

  function onBet(index, team) {
    setModal([index, team]);
  }

  function testButton() {
    testWeb3();
  }

  return (
    <div className="App">
      <h1>Sports Betting</h1>
      <MultiSwitch
        options={["schedule", "my bets"]}
        color="hsl(160, 100%, 30%)"
        className="multi-switch outfit"
        setIndex={setPage}
      />
      {modal && (
        <BetModal
          game={schedule[modal[0]]}
          team={modal[1]}
          cancel={() => setModal(undefined)}
          submit={() => setModal(undefined)}
        />
      )}
      {page === 0 ? (
        <table className="bets-list">
          <tbody>
            {schedule.map((game, i) => (
              <tr className="game-row">
                <td style={{ textAlign: "left" }}>
                  <button onClick={() => onBet(i, 0)}>Bet</button>
                  {game.opponent0}
                </td>
                <td style={{ textAlign: "center" }}>
                  <p style={{ color: game.odds > 0 ? "green" : "red" }}>
                    {game.odds > 0 ? "+" + game.odds : game.odds}
                  </p>
                  {game.date.toLocaleDateString()}
                  {"\u2022"} {game.date.toLocaleTimeString()}
                </td>
                <td style={{ textAlign: "right" }}>
                  {game.opponent1}
                  <button onClick={() => onBet(i, 1)}>Bet</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="bets-list">
          <tbody>
            {myBets.map((bet) => (
              <tr className="outfit">
                <td>
                  {bet.opponent0} vs {bet.opponent1}
                </td>
                <td style={{ textAlign: "center" }}>
                  {bet.bet} coins on{" "}
                  {bet.on === 0 ? bet.opponent0 : bet.opponent1} to win{" "}
                  {getPayout(bet.bet, bet.odds)} (
                  <span style={{ color: bet.odds > 0 ? "green" : "red" }}>
                    {bet.odds > 0 ? "+" + bet.odds : bet.odds})
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  {bet.date.toLocaleDateString()} {"\u2022"}{" "}
                  {bet.date.toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={testButton}>TEST</button>
    </div>
  );
}

export function getPayout(bet, odds) {
  if (Number(odds) > 0) {
    return Number(bet) + (Number(bet) / 100) * Number(odds);
  } else {
    return (-Number(bet) / Number(odds)) * 100;
  }
}

export default App;
