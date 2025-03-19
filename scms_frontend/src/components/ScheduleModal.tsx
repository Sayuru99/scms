import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { apiRequest } from '../lib/api';
import WeekScheduleCard from './FormFieldCard';

const ScheduleModal: React.FC = () => {
  const [show, setShow] = useState(false);
  const [className, setClassName] = useState('');
  const [classDate, setClassDate] = useState('');
  const [classTime, setClassTime] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await apiRequest('/api/classes', 'POST', {
        name: className,
        date: classDate,
        time: classTime,
      });
      console.log('Class scheduled successfully:', response);
      handleClose();
    } catch (error) {
      console.error('Error scheduling class:', error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Schedule Class
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule a New Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <WeekScheduleCard
              controlId="formClassName"
              label="Class Name"
              type="text"
              placeholder="Enter class name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />

            <WeekScheduleCard
              controlId="formClassDate"
              label="Date"
              type="date"
              value={classDate}
              onChange={(e) => setClassDate(e.target.value)}
              required
            />

            <WeekScheduleCard
              controlId="formClassTime"
              label="Time"
              type="time"
              value={classTime}
              onChange={(e) => setClassTime(e.target.value)}
              required
            />

            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ScheduleModal; 