import { useState } from "react";
import { getPayout } from "../App";

export function BetModal(props) {
  const [bet, setBet] = useState(1);

  return (
    <div className="modal-full">
      <div>
        <h2>Place Bet</h2>
        <h3>{props.game.opponent0}</h3>
        <div>vs</div>
        <h3>{props.game.opponent1}</h3>
        <div style={{ color: props.game.odds > 0 ? "green" : "red" }}>
          {props.game.odds > 0 ? "+" + props.game.odds : props.game.odds}
        </div>
        <div className="stretch"></div>
        <input
          onChange={(e) => setBet(e.target.value)}
          value={bet}
          type="number"
        ></input>
        <p>
          Bet {bet} coins on the{" "}
          {props.team === 0 ? props.game.opponent0 : props.game.opponent1} to
          win {getPayout(bet, props.game.odds)} coins
        </p>
        <div className="stretch"></div>
        <div className="modal-buttons">
          <button onClick={props.cancel}>Cancel</button>
          <button onClick={props.submit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
