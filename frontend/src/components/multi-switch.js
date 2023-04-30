import { useEffect, useState, useRef } from "react";
import "./multi-switch.css";

export function MultiSwitch(props) {
  const [bubbleLeft, setBubbleLeft] = useState(0);
  const [bubbleWidth, setBubbleWidth] = useState(-20);
  const divRef = useRef(null);

  function handleClick(i) {
    if (divRef.current) {
      if (props.setIndex)
        props.setIndex(i);
      setBubbleLeft(divRef.current.childNodes[i].offsetLeft);
      setBubbleWidth(divRef.current.childNodes[i].offsetWidth);
    }
  }

  useEffect(() => handleClick(0), [divRef]);

  return (
    <div
      ref={divRef}
      className={`outer-div ${props.className || ''}`}
      style={props.style}
    >
      {props.options.map((name, i) => (
        <p className="option" onClick={() => handleClick(i)}>
          {name}
        </p>
      ))}
      <div
        style={{
          transform: `translate(${bubbleLeft - 10}px)`,
          width: `${bubbleWidth + 20}px`,
          backgroundColor: props.color,
        }}
        className="bubble"
      ></div>
    </div>
  );
}
