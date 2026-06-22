function ChipsRow({ chips, onChipClick }) {
  return (
    <div id="chips-row">
      {chips.map((chip) => (
        <button key={chip} type="button" className="chip" onClick={() => onChipClick(chip)}>
          {chip}
        </button>
      ))}
    </div>
  );
}

export default ChipsRow;
