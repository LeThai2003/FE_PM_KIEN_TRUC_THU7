import React, { useMemo } from 'react'
import { Column } from '@ant-design/plots';
import { useSelector } from 'react-redux';

const ColumnBasic = ({data}) => {

  const {isDarkMode} = useSelector(state => state.globals);

  const config = useMemo(() => ({
    data,
    height: 300,
    xField: 'status',
    yField: 'count',
    xAxis: {
      label: {
        autoRotate: false,
        style: () => ({
          fill: isDarkMode ? '#e5e7eb' : '#333',
          fontSize: 12,
          fontWeight: 500,
        }),
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            stroke: isDarkMode ? "#ddd" : '#333',      
            lineDash: [4, 4],    
            opacity: 0.5,        
          },
        },
        // visible: false,
      },
      label: {
        style: () => ({
          fill: isDarkMode ? '#e5e7eb' : '#333',
          fontSize: 12,
          fontWeight: 500,
        }),
      }
    },
    color: isDarkMode ? "#6c5cff" : '#6c5ce7',
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.7,
        fontSize: 16
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
  }), [data, isDarkMode]);


  return (
    <div>
      <Column {...config} />
    </div>
  )
}

export default ColumnBasic