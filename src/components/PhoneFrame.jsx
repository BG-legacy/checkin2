// Renders one mock screen of the fictional "Streamly" app inside a phone
// frame. Everything inside the frame is decorative: the respondent steps
// through with the survey's own Next button, so mock buttons are not focusable.
function ScreenElement({ element }) {
  switch (element.kind) {
    case 'title':
      return <h3 className="phone-title">{element.text}</h3>;
    case 'text':
      return <p className="phone-text">{element.text}</p>;
    case 'note':
      return <p className="phone-note">{element.text}</p>;
    case 'rows':
      return (
        <ul className="phone-rows">
          {element.items.map((item) => (
            <li key={item} className="phone-row">
              <span>{item}</span>
              <span className="phone-row-chevron" aria-hidden="true">
                ›
              </span>
            </li>
          ))}
        </ul>
      );
    case 'rowButton':
      return <div className="phone-row phone-row-action">{element.label}</div>;
    case 'button':
      return (
        <div className={`phone-button phone-button-${element.variant}`}>{element.label}</div>
      );
    case 'link':
      return <div className={`phone-link phone-link-${element.variant}`}>{element.label}</div>;
    case 'choices':
      return (
        <ul className="phone-choices">
          {element.items.map((item) => (
            <li key={item} className="phone-choice">
              <span className="phone-choice-radio" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'bullets':
      return (
        <ul className="phone-bullets">
          {element.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default function PhoneFrame({ screen }) {
  return (
    <div className="phone-frame">
      <div className="phone-statusbar" aria-hidden="true">
        <span>9:41</span>
        <span>●●●</span>
      </div>
      <div className="phone-appbar">Streamly</div>
      <div className="phone-screen">
        {screen.elements.map((element, i) => (
          <ScreenElement key={i} element={element} />
        ))}
      </div>
    </div>
  );
}
