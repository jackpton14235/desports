import { useEffect, useState } from "react";
import { getPayout } from "../App";
import { getBets, placeBet } from "../logic/metamask";
import Web3 from "web3";

const numberRegex = /[^\d^.]/g;

export function BetModal(props) {
  const [bet, setBet] = useState('');
  const [pool, setPool] = useState();
  const [message, setMessage] = useState('');

  useEffect(() => {
    getBets(props.game.id).then(res => {
      setPool(res);
    }).catch(console.error);
  }, [props.game.id]);

  function onSubmit() {
    const wei = betValid();
    if (!wei) return;
    setMessage('Loading');
    placeBet(wei, props.game.id, props.home)
    .then(res => {
      console.log(res);
      setMessage('Success');
      setTimeout(() => props.close(), 1000);
    })
    .catch(console.error)
  }

  function betValid() {
    try {
      const wei = Web3.utils.toWei(bet, 'ether');
      return wei;
    } catch (ex) {
      return false;
    }
  }

  return (
    <div className="modal-full">
      <div>
        <h2>Place Bet</h2>
        <div className="flex-row matchup">
          <div className="flex-col">
            <img src={props.game.teams.home.logo} alt="" />
            <p>{props.game.teams.home.name}</p>
          </div>
          <p>vs</p>
          <div className="flex-col">
            <img src={props.game.teams.away.logo} alt="" />
            <p>{props.game.teams.away.name}</p>
          </div>
        </div>
        {pool &&
        (
          <p>Pool size: {(pool?.home + pool?.away) / 1e18}ETH</p>
        )}
        <div style={{ color: props.game.odds > 0 ? "green" : "red" }}>
          {props.game.odds > 0 ? "+" + props.game.odds : props.game.odds}
        </div>
        <div className="stretch"></div>
        {/* type is text to allow high precision */}
        <input
          onChange={(e) => setBet(e.target.value.replace(numberRegex, ''))}
          value={bet}
          type="text"
        ></input>
        <p style={{textAlign: "center"}}>
          Based on current pool sizes, pays out <b>{getPayout(bet.toString(), pool?.home, pool?.away, props.home)}</b> ETH
        </p>
        <p>{message}</p>
        <div className="stretch"></div>
        <div className="modal-buttons">
          <button onClick={props.close}>Cancel</button>
          <button onClick={onSubmit} style={{backgroundColor: betValid() ? false : '#bbb'}}>Submit</button>
        </div>
      </div>
    </div>
  );
}
