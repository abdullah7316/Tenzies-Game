import React from "react";

export default function Dice(props) {
    let bgColor = {
        backgroundColor: props.color ? 'lightgreen' : 'rgb(247,247,247)',
    }
    return (
        <div
            className="dice--div flex-all-center"
            style={bgColor}
            onClick={() => props.onClick(props.diceNum, props.id)}
        >
            <p>{props.diceNum}</p>
        </div>
    )
}