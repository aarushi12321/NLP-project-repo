export function Footer( {isSmallMenuExpanded} ) {
    return (
      <div className={`chatbot-footer ${isSmallMenuExpanded ? 'shifted' : ''}`}>
        <p>Made by Aarushi</p>
      </div>
    );
  }

