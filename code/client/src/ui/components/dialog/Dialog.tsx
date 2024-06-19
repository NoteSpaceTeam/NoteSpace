import React, { useState } from 'react';
import {
  Dialog as MaterialDialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import './Dialog.scss';

interface Field {
  name: string;
  label: string;
  type?: string;
}

interface DialogProps {
  title: string;
  fields: Field[];
  onSubmit: (values: { [key: string]: any }) => void;
  submitText?: string;
  extraContent?: React.ReactNode;
  children: React.ReactNode;
}

function Dialog({ title, fields, onSubmit, submitText, extraContent, children }: DialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<{ [key: string]: any }>(
    fields.reduce((obj, item) => ({ ...obj, [item.name]: item.type === 'checkbox' ? false : '' }), {})
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

  const handleChange = (name: string, type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: type === 'checkbox' ? event.target.checked : event.target.value });
  };

  return (
    <div className="dialog">
      <button onClick={handleOpen} className="button">
        {children}
      </button>
      <MaterialDialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {fields.map(field =>
            field.type === 'checkbox' ? (
              <FormControlLabel
                key={field.name}
                control={
                  <Checkbox
                    checked={values[field.name]}
                    onChange={handleChange(field.name, field.type)}
                    name={field.name}
                  />
                }
                label={field.label}
              />
            ) : (
              <TextField
                className="text-field"
                key={field.name}
                autoFocus
                margin="dense"
                label={field.label}
                type="text"
                fullWidth
                value={values[field.name]}
                onChange={handleChange(field.name, field.type!)}
              />
            )
          )}
          {extraContent}
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose}>Cancel</button>
          <button onClick={handleSubmit}>{submitText || 'Submit'}</button>
        </DialogActions>
      </MaterialDialog>
    </div>
  );
}

export default Dialog;
