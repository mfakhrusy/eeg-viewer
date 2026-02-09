import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useEegStore } from '@/stores/eegStore';

const CHANNEL_HEIGHT = 80;
const MARGIN = { top: 20, right: 20, bottom: 30, left: 60 };

export function WaveformViewer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { channels, sampleRate, timeWindow, scrollOffset } = useEegStore();

  const visibleChannels = channels.filter((ch) => ch.visible);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || visibleChannels.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = visibleChannels.length * CHANNEL_HEIGHT + MARGIN.top + MARGIN.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const startSample = Math.floor(scrollOffset * sampleRate);
    const endSample = Math.floor((scrollOffset + timeWindow) * sampleRate);

    const xScale = d3
      .scaleLinear()
      .domain([scrollOffset, scrollOffset + timeWindow])
      .range([MARGIN.left, width - MARGIN.right]);

    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat((d) => `${d}s`);
    svg
      .append('g')
      .attr('transform', `translate(0,${height - MARGIN.bottom})`)
      .attr('class', 'text-zinc-400')
      .call(xAxis);

    visibleChannels.forEach((channel, i) => {
      const yCenter = MARGIN.top + i * CHANNEL_HEIGHT + CHANNEL_HEIGHT / 2;
      const slicedData = channel.data.slice(startSample, endSample);

      const yExtent = d3.extent(slicedData) as [number, number];
      const yMax = Math.max(Math.abs(yExtent[0]), Math.abs(yExtent[1]), 1);

      const yScale = d3
        .scaleLinear()
        .domain([-yMax / channel.amplitude, yMax / channel.amplitude])
        .range([yCenter + CHANNEL_HEIGHT / 2 - 4, yCenter - CHANNEL_HEIGHT / 2 + 4]);

      if (i > 0) {
        svg
          .append('line')
          .attr('x1', MARGIN.left)
          .attr('x2', width - MARGIN.right)
          .attr('y1', yCenter - CHANNEL_HEIGHT / 2)
          .attr('y2', yCenter - CHANNEL_HEIGHT / 2)
          .attr('stroke', '#27272a')
          .attr('stroke-width', 1);
      }

      svg
        .append('text')
        .attr('x', 8)
        .attr('y', yCenter)
        .attr('dy', '0.35em')
        .attr('fill', channel.color)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(channel.label);

      const step = Math.max(1, Math.floor(slicedData.length / (width * 2)));
      const downsampledData = slicedData.filter((_, j) => j % step === 0);

      const line = d3
        .line<number>()
        .x((_, j) => xScale(scrollOffset + (j * step) / sampleRate))
        .y((d) => yScale(d))
        .curve(d3.curveLinear);

      svg
        .append('path')
        .datum(downsampledData)
        .attr('fill', 'none')
        .attr('stroke', channel.color)
        .attr('stroke-width', 1.2)
        .attr('opacity', 0.85)
        .attr('d', line as never);
    });
  }, [visibleChannels, sampleRate, timeWindow, scrollOffset]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden bg-zinc-950 rounded-lg border border-zinc-800">
      {visibleChannels.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-zinc-500">
          No channels to display. Generate data or enable channels.
        </div>
      ) : (
        <svg ref={svgRef} className="w-full" />
      )}
    </div>
  );
}
