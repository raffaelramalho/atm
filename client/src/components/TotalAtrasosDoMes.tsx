import React from 'react';
import { ResponsivePie } from '@nivo/pie';

interface TotalAtrasosDoMesProps {
  mesAtual: number;
  mesPassado: number;
}

const TotalAtrasosDoMes: React.FC<TotalAtrasosDoMesProps> = ({ mesAtual, mesPassado }) => {
  const data = [
    {
      "id": "Mês Atual",
      "label": "-",
      "value": mesAtual,
      "color": "hsl(152, 70%, 50%)"
    },
    {
      "id": "Mês Passado",
      "label": "-",
      "value": mesPassado,
      "color": "hsl(88, 70%, 50%)"
    }
  ];

  return (
    <div className="p-4 bg-background rounded shadow h-full shadow-md">
      <h2 className="text-lg font-semibold mb-2">Atrasos do Mês atual X Mês passado</h2>
      <div className='h-5/6'>
        <ResponsivePie
          data={data}
          margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
          innerRadius={0.3}
          padAngle={0.3}
          cornerRadius={1}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
          enableRadialLabels={false}
          slicesLabelsSkipAngle={30}
          slicesLabelsTextColor="#333333"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </div>
  );
}

export default TotalAtrasosDoMes;
