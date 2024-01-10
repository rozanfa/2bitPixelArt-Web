type ProgressBarProps = {
  progressValue: number;
};

const ProgressBar = ({ progressValue }: ProgressBarProps) => {
  const containerStyles = {
    height: 8,
    width: "auto",
    borderRadius: 50,
  };

  const fillerStyles = {
    height: "100%",
    width: `${progressValue}%`,
    borderRadius: "inherit",
  };

  return (
    <div style={containerStyles} className="bg-slate-200">
      <div style={fillerStyles} className="bg-slate-900"></div>
    </div>
  );
};

export default ProgressBar;
