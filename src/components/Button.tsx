export interface ButtonProps {
  color: "primary" | "secondary" | "danger";
  children: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean; 
}

const Button = ({ color, children, onClick, disabled }: ButtonProps) => {
  return (
    <button
      type="button"
      className={`btn btn-${color} mb-3 me-2`}
      onClick={onClick}
      disabled={disabled} 
    >
      {children}
    </button>
  );
};

export default Button;
