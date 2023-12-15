import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = () => {
  const [dataFim, setDataFim] = useState(null);

  const handleChange = (date) => {
    setDataFim(date);
  };

  return (
    <div>
      <p className='font-medium'>Data final da liberação:</p>
      <DatePicker
        selected={dataFim}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy" // formato da data que será exibido
        className='border border-solid'
      />
    </div>
  );
};

export default DatePicker;

