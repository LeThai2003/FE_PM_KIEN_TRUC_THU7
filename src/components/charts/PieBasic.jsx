import React, { useCallback, useMemo } from 'react'
import { Pie, measureTextWidth } from '@ant-design/plots';
import { useSelector } from 'react-redux';

const PieBasic = ({data}) => {

  const {isDarkMode} = useSelector(state => state.globals);

  const titleCustomHtml = useCallback((container, view, datum) => {
    const { width, height } = container.getBoundingClientRect();
    const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
    const text = datum ? datum.type : 'Projects';
    const color = isDarkMode ? '#e5e7eb' : '#333';

    return `<div style="width:${d}px;text-align:center;font-size:18px;color:${color};">${text}</div>`;
  }, [isDarkMode]);

  const contentCustomHtml = useCallback((container, view, datum, data) => {
    const { width } = container.getBoundingClientRect();
    const text = datum ? `${datum.percent}%` : `${data.reduce((r, d) => r + d.percent, 0)}%`;
    const color = isDarkMode ? '#e5e7eb' : '#333';

    return `<div style="width:${width}px;text-align:center;font-size:16px;color:${color};">${text}</div>`;
  }, [isDarkMode]);

  const getColor = useCallback(({ type }) => {
    if (type === 'Completed') {
      return isDarkMode ? "#6c5cff" : '#6c5ce7';
    }
    return isDarkMode ? "#ffca45" : '#fdcb6e';
  }, [isDarkMode]);

  const config = useMemo(() => ({
    data,
    height: 300,
    colorField: 'type', 
    color: getColor,
    angleField: 'percent',
    radius: 1,
    innerRadius: 0.64,
    meta: {
      value: {
        formatter: (v) => `${v} %`,
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center',
      },
      autoRotate: false,
      content: '{value}%',
    },
    legend: {
      position: 'right',
      itemName: {
        style: {
          fill: isDarkMode ? '#e5e7eb' : '#333',
          fontSize: 14,
          fontWeight: 500,
        },
      },
      marker: {
        symbol: 'circle', // 'square', 'diamond'
        style: {
          r: 5, // bán kính marker (nếu là circle)
        },
      },
    },
    state: {
      active: {
        style: {
          stroke: isDarkMode ? '#ffffff' : '#b37a00',
          lineWidth: 2,
        },
      },
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: titleCustomHtml,
      },
      content: {
        offsetY: 4,
        customHtml: contentCustomHtml,
      },
    },

    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
  }), [data, isDarkMode, titleCustomHtml, contentCustomHtml]);

  return (
    <Pie {...config} />
  )
}

export default PieBasic