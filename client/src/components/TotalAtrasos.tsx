import React from 'react';
import { ResponsivePie } from '@nivo/pie';

interface TotalAtrasosDoMesProps {
  mesNome: string;
  mesAtrasos: number;
}

const TotalAtrasosDoMes: React.FC<TotalAtrasosDoMesProps> = ({ mesNome, mesAtrasos }) => {


  return (
    <div className="p-4 bg-background rounded shadow h-full shadow-md ">
      <h2 className="text-lg font-semibold mb-2">Atrasos Totais</h2>
      <div style={{height: "300px"}} className='flex flex-col items-center justify-center'>
        <p className='font-medium'>{mesNome}</p>
        <p className='text-8xl m-5'>{mesAtrasos}</p>
      </div>
    </div>
  );
}

export default TotalAtrasosDoMes;
