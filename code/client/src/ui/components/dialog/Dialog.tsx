import React, { useState } from 'react';
import { Dialog as MaterialDialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import './Dialog.scss';

interface Field {
  name: string;
  label: string;
}

interface DialogProps {
  title: string;
  fields: Field[];
  onSubmit: (values: { [key: string]: string }) => void;
  children: React.ReactNode;
}

function Dialog({ title, fields, onSubmit, children }: DialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<{ [key: string]: string }>(
    fields.reduce((obj, item) => ({ ...obj, [item.name]: '' }), {})
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    onSubmit(values);
    handleClose();
  };

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <div className="dialog">
      <Button onClick={handleOpen} className="button">
        {children}
      </Button>
      <MaterialDialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {fields.map(field => (
            <TextField
              key={field.name}
              autoFocus
              margin="dense"
              label={field.label}
              type="text"
              fullWidth
              value={values[field.name]}
              onChange={handleChange(field.name)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </MaterialDialog>
    </div>
  );
}

export default Dialog;
