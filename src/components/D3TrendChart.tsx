import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function D3TrendChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear previous
    d3.select(chartRef.current).selectAll('*').remove();

    const data = [
      { date: new Date(2026, 8, 1), generation: 140, efficiency: 95 },
      { date: new Date(2026, 8, 2), generation: 135, efficiency: 92 },
      { date: new Date(2026, 8, 3), generation: 150, efficiency: 97 },
      { date: new Date(2026, 8, 4), generation: 120, efficiency: 88 },
      { date: new Date(2026, 8, 5), generation: 160, efficiency: 98 },
      { date: new Date(2026, 8, 6), generation: 155, efficiency: 96 },
      { date: new Date(2026, 8, 7), generation: 165, efficiency: 99 },
    ];

    const margin = { top: 20, right: 40, bottom: 30, left: 40 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y1 = d3.scaleLinear()
      .domain([0, 200])
      .range([height, 0]);

    const y2 = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat('%b %d') as any))
      .attr('class', 'text-slate-500 font-sans text-xs');

    svg.append('g')
      .call(d3.axisLeft(y1).ticks(5))
      .attr('class', 'text-amber-500 font-sans text-xs');

    svg.append('g')
      .attr('transform', `translate(${width},0)`)
      .call(d3.axisRight(y2).ticks(5))
      .attr('class', 'text-emerald-500 font-sans text-xs');

    const line1 = d3.line<any>()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.date))
      .y(d => y1(d.generation));

    const line2 = d3.line<any>()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.date))
      .y(d => y2(d.efficiency));

    // Area generation
    const area1 = d3.area<any>()
      .curve(d3.curveMonotoneX)
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y1(d.generation));

    svg.append('path')
      .datum(data)
      .attr('fill', '#f59e0b')
      .attr('fill-opacity', 0.1)
      .attr('d', area1);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 3)
      .attr('d', line1);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('d', line2);

    // Points Gen
    svg.selectAll('.dotGen')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dotGen')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y1(d.generation))
      .attr('r', 4)
      .attr('fill', '#fff')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 2);

    // Points Eff
    svg.selectAll('.dotEff')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dotEff')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y2(d.efficiency))
      .attr('r', 4)
      .attr('fill', '#fff')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2);

    // Labels
    svg.append('text')
      .attr('x', 10)
      .attr('y', 10)
      .attr('fill', '#f59e0b')
      .attr('class', 'text-xs font-bold')
      .text('Generación (MW)');

    svg.append('text')
      .attr('x', width - 80)
      .attr('y', 10)
      .attr('fill', '#10b981')
      .attr('class', 'text-xs font-bold')
      .text('Eficiencia (%)');

  }, []);

  return <div ref={chartRef} className="w-full h-[300px]" />;
}
