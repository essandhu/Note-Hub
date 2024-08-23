import { useEffect, useRef, useState, useContext } from "react";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";
import Spinner from "../icons/Spinner";
import DeleteButton from "./DeleteButton";
import { db } from "../appwrite/databases";
import { NoteContext } from "../context/NoteContext";

const NoteCard = ({ note }) => {
    const body = bodyParser(note.body);                                 // Parse note text content
    const [position, setPosition] = useState(JSON.parse(note.position)) // Parse note position
    const colors = JSON.parse(note.colors);                             // Parse note background color
    let mouseStartPos = { x: 0, y: 0 };                                 // Initial mouse position
    const [saving, setSaving] = useState(false);                        // State for saving note data

    const keyUpTimer = useRef(null);                                    // Timer for keyup event
    const textAreaRef = useRef(null);                                   // Reference to the text area (for autogrowing height of notes)
    const cardRef = useRef(null);                                       // Reference to the note card (for dragging)
    const { setSelectedNote } = useContext(NoteContext);

    
    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);     // Make sure new note is always visible
    }, []); 

    // When user has finished typing
    const handleKeyUp = async () => {
        setSaving(true);
        // Clear current timer value when update is made
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current)
        }
        // Use 2 second delay before saving data
        handleKeyUp.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);
    };

    // Used to control movement when clicking and dragging a note
    const mouseDown = (e) => {
        // Only update when clicking on note header
        if (e.target.className === "card-header") {
            // Bring note to front
            setZIndex(cardRef.current);
            setSelectedNote(note);
            mouseStartPos = { x: e.clientX, y: e.clientY };
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
        }
    };
    // Used to stop movement when mouse is released
    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
        // After moving note, save new position to the database
        const newPos = setNewOffset(cardRef.current);
        saveData("position", newPos);
    };

    // Event listener for mouse movement
    const mouseMove = (e) => {
        // Calculate move direction
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };
     
        // Update start position for next move
        mouseStartPos = { x: e.clientX, y: e.clientY };
     
        // Update card top and left position
        const newPos = setNewOffset(cardRef.current, mouseMoveDir);
        setPosition(newPos);
    };

    // Save note data to the database (position, body, or color)
    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    return (
        <div
            ref={cardRef}
            className="card"
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        >
            <div 
                className="card-header"
                style={{ backgroundColor: colors.colorHeader }}
                onMouseDown={mouseDown}
            >
                {saving && (
                    <div className="card-saving">
                        <Spinner color={colors.colorText} />
                        <span style={{ color: colors.colorText }}>Saving...</span>
                    </div>
                )}
                <DeleteButton noteId={note.$id} />
            </div>

            <div className="card-body">
                <textarea
                    ref={textAreaRef}
                    style={{ color: colors.colorText }}
                    defaultValue={body}
                    onInput={() => autoGrow(textAreaRef)}
                    onFocus={() => {
                        setZIndex(cardRef.current)
                        setSelectedNote(note)
                    }}
                    onKeyUp={handleKeyUp}
                >
                </textarea>
            </div>
        </div>
    );
}

export default NoteCard;