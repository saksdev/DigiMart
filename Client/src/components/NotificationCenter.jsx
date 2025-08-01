import React, { useState, useEffect, useCallback } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";
import "./Css/NotificationCenter.css";

export default function NotificationCenter() {
  const [notes, setNotes] = useState([]);

  // Add new notification
  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now().toString();
    setNotes(prev => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setNotes(prev => prev.filter(note => note.id !== id));
    }, 3000);
  }, []);

  // Attach to global window for easy access
  useEffect(() => {
    window.showNotification = addNotification;
  }, [addNotification]);

  return (
    <Flipper flipKey={notes.map(note => note.id).join("")}>
      <div className="notification-center">
        {notes.map(({ id, message, type }) => (
          <Flipped key={id} flipId={id}>
            <div className={`notification ${type}`}>{message}</div>
          </Flipped>
        ))}
      </div>
    </Flipper>
  );
}
