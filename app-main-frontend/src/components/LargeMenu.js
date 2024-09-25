export function LargeMenu({ isExpanded }) {
  return (
    <div className={`large-menu ${isExpanded ? "expanded" : ""}`}>
      {/* Large menu content */}
      <ul className={`${isExpanded ? "expanded" : ""}`}>
        <li>Large Menu Item 1</li>
        <li>Large Menu Item 2</li>
        <li>Large Menu Item 3</li>
      </ul>
    </div>
  );
}
