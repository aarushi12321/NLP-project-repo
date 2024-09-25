import React from 'react';

export function SmallMenu({ isSmallMenuExpanded, toggleMenu}) {
  return (
    <div className='small-menu-container'>
      <button onClick={toggleMenu} className='history-toggle-button'>
        {isSmallMenuExpanded ? 'Close History' : 'Open History'}
      </button>
    </div>
  );
}
