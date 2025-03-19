import React from 'react';
import { Form } from 'react-bootstrap';

interface FormFieldCardProps {
  controlId: string;
  label: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const WeekScheduleCard: React.FC<FormFieldCardProps> = ({
  controlId,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </Form.Group>
  );
};

export default WeekScheduleCard; 