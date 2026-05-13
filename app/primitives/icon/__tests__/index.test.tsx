import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from '../icon';

describe('Icon', () => {
  it('renders an SVG element', () => {
    render(<Icon name='searchAlt' />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies default size of 24', () => {
    render(<Icon name='searchAlt' />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('applies custom size', () => {
    render(<Icon name='searchAlt' size={32} />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('applies custom width and height separately', () => {
    render(<Icon name='searchAlt' width={40} height={20} />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('width', '40');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('applies id when provided', () => {
    render(<Icon name='searchAlt' id='my-icon' />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('id', 'my-icon');
  });

  it('applies className', () => {
    render(<Icon name='searchAlt' className='custom-class' />);
    const svg = document.querySelector('svg');
    // SVG className is an SVGAnimatedString — use getAttribute or classList
    expect(svg?.classList.contains('custom-class')).toBe(true);
  });

  it('renders a multi-path icon (array path)', () => {
    // logo is a multi-path icon that should render multiple <path> elements
    render(<Icon name='logo' />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThanOrEqual(1);
  });

  it('renders a single-path icon', () => {
    render(<Icon name='searchAlt' />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies fill color', () => {
    render(<Icon name='searchAlt' color='red' />);
    const path = document.querySelector('path');
    expect(path).toHaveAttribute('fill', 'red');
  });
});
