// Update top and left position of note card to enfore borders
export const setNewOffset = (card, mouseMoveDir = { x: 0, y: 0 }) => {
  const offsetLeft = card.offsetLeft - mouseMoveDir.x;
  const offsetTop = card.offsetTop - mouseMoveDir.y;

  return {
    x: offsetLeft < 0 ? 0 : offsetLeft,
    y: offsetTop < 0 ? 0 : offsetTop,
  };
};

// Used to automatically resize note height as text is added or removed
export function autoGrow(textAreaRef) {
  const { current } = textAreaRef;
  // Reset height, then adjust to new height
  current.style.height = "auto";
  current.style.height = current.scrollHeight + "px";
}

// Ensure currently selected card is on top of all other cards
export const setZIndex = (selectedCard) => {
  selectedCard.style.zIndex = 999;

  Array.from(document.getElementsByClassName("card")).forEach((card) => {
    if (card !== selectedCard) {
      card.style.zIndex = selectedCard.style.zIndex - 1;
    }
  });
};

// Parse JSON data if parsable, otherwise return the original value
export const bodyParser = (value) => {
  try {
    JSON.parse(value);
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};
