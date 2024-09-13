import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Sources from './Sources';
import '@testing-library/jest-dom/extend-expect';

const mockSources = [
  {
    chart_source: 'Source 1',
    chart_source_link: 'http://example.com/source1',
    organisation: 'Organisation 1',
    title: 'Title 1',
    link: 'http://example.com/link1',
  },
  {
    chart_source: 'Source 2',
    chart_source_link: 'http://example.com/source2',
    organisation: 'Organisation 2',
    title: 'Title 2',
    link: 'http://example.com/link2',
  },
];

describe('Sources', () => {
  it('renders the Sources button', () => {
    render(<Sources sources={mockSources} />);
    expect(screen.getByText('Sources')).toBeInTheDocument();
  });

  it('opens and closes the popup on click', () => {
    render(<Sources sources={mockSources} />);

    const triggerButton = screen.getByText('Sources');

    expect(screen.queryByText('Source 1')).toBeInTheDocument();

    fireEvent.click(triggerButton);
    expect(screen.getByText('Source 1')).toBeInTheDocument();
    expect(screen.getByText('Source 2')).toBeInTheDocument();

    fireEvent.click(triggerButton);
  });

  it('renders sources correctly', () => {
    render(<Sources sources={mockSources} />);

    const triggerButton = screen.getByText('Sources');
    fireEvent.click(triggerButton);

    expect(screen.getByText('Source 1')).toBeInTheDocument();
    expect(screen.getByText('Source 2')).toBeInTheDocument();

    expect(screen.getByText('Source 1').closest('a')).toHaveAttribute(
      'href',
      'http://example.com/source1',
    );
    expect(screen.getByText('Source 2').closest('a')).toHaveAttribute(
      'href',
      'http://example.com/source2',
    );
  });

  it('renders a message when there are no sources', () => {
    render(<Sources sources={[]} />);

    const triggerButton = screen.getByText('Sources');
    fireEvent.click(triggerButton);

    expect(
      screen.getByText('Data provenance is not set for this visualization.'),
    ).toBeInTheDocument();
  });
});
