import Plus from "../icons/Plus";
import colors from '../assets/colors';
import React, { useContext, useRef } from "react";
import { NoteContext } from "../context/NoteContext";
import { db } from "../appwrite/databases";
 
const AddButton = () => {
    const startPos = useRef(10);
    const { setNotes } = useContext(NoteContext);

    const addNote = async () => {
        const payload = {
            position: JSON.stringify({
                x: startPos.current,
                y: startPos.current,
            }),
            colors: JSON.stringify(colors[0]),
        };
        startPos.current += 10;
        const response = await db.notes.create(payload);
        setNotes((prevState) => [response, ...prevState]);
    };

    return (
        <div id="add-btn" onClick={addNote}>
            <Plus />
        </div>
    );
};

export default AddButton;