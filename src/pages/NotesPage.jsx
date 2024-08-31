import NoteCard from "../components/NoteCard";
import ControlPanel from "../components/ControlPanel";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";

const NotesPage = () => {
  // Fetch notes data from database
  const { notes } = useContext(NoteContext);

  return (
    <div>
      <ControlPanel />
      {notes.map((note) => (
        <NoteCard key={note.$id} note={note} />
      ))}
    </div>
  );
};

export default NotesPage;
