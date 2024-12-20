export function LargeMenu({ isExpanded, chatSessions, handleSessionClick }) {
  return (
    <div className={`large-menu ${isExpanded ? "expanded-history" : ""}`}>
      <div className="history-large-menu">
        <p>HISTORY</p>
      </div>
      <ul className={`${isExpanded ? "expanded-history" : ""}`}>
        {isExpanded && chatSessions.length > 0 ? (
          chatSessions.map((session, index) => (
            <li
              className="chat-session-item"
              key={index}
              onClick={() => handleSessionClick(session)}
            >
              <p className="user-question">
                {session.chatHistory.length > 0
                  ? session.chatHistory[0].text
                  : "..."}
              </p>
            </li>
          ))
        ) : (
          <li className="chat-session-item default">No chat sessions yet</li>
        )}
      </ul>
    </div>
  );
}
