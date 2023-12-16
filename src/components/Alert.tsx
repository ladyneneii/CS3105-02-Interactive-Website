import React from 'react'

interface AlertComponentProps {
    color: string;
    children: string;
}

const Alert = ({color, children}: AlertComponentProps) => {
  return (
    <div className={`alert alert-${color}`} role="alert">
      {children}
    </div>
  );
}

export default Alert