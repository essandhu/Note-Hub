import AddButton from "./AddButton";
import colors from "../assets/colors";
import Color from "./Color";
import React from "react";

const ControlPanel = () => {
  return (
    <div id="control-panel">
      <AddButton />
      {colors.map((color) => (
        <Color key={color.id} color={color} />
      ))}
    </div>
  );
};

export default ControlPanel;
