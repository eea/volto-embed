import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Sources from './Sources';
import '@testing-library/jest-dom';

vi.mock('semantic-ui-react', async () => {
  const actual = await vi.importActual('semantic-ui-react');
  return {
    ...actual,
    Popup: ({ trigger, content, onOpen, onClose }) => (
      <div className="popup">
        {trigger}
        <button className="popup-open" onClick={onOpen} />
        <button className="popup-close" onClick={onClose} />
        <div className="content">{content}</div>
      </div>
    ),
  };
});

vi.mock('@plone/volto/components/manage/UniversalLink/UniversalLink', () => {
  return {
    default: ({ children, href, ...rest }) => (
      <a href={href} {...rest}>
        {children}
      </a>
    ),
  };
});

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

  it('renders a chart source without a link as plain text', () => {
    render(<Sources sources={[{ chart_source: 'Source 3' }]} />);

    fireEvent.click(screen.getByText('Sources'));

    expect(screen.getByText('Source 3').closest('a')).toBeNull();
  });

  it('renders a fallback source with link and organisation', () => {
    render(
      <Sources
        sources={[
          {
            title: 'Title 4',
            link: 'http://example.com/link4',
            organisation: 'Organisation 4',
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByText('Sources'));

    expect(screen.getByText('Title 4').closest('a')).toHaveAttribute(
      'href',
      'http://example.com/link4',
    );
    expect(screen.getByText('Organisation 4')).toBeInTheDocument();
  });

  it('renders a fallback source without a link as plain text', () => {
    render(<Sources sources={[{ title: 'Title 5' }]} />);

    fireEvent.click(screen.getByText('Sources'));

    expect(screen.getByText('Title 5').closest('a')).toBeNull();
  });

  it('opens and closes the popup through the trigger', () => {
    const { container } = render(<Sources sources={mockSources} />);

    const triggerButton = screen.getByText('Sources');
    expect(triggerButton).not.toHaveClass('open');

    fireEvent.click(container.querySelector('.popup-open'));
    expect(screen.getByText('Sources')).toHaveClass('open');

    fireEvent.click(container.querySelector('.popup-close'));
    expect(screen.getByText('Sources')).not.toHaveClass('open');
  });
});
