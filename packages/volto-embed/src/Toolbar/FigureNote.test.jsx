import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FigureNote, { serializeText } from './FigureNote';
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

describe('FigureNote', () => {
  it('opens and closes the popup through the trigger', () => {
    const { container } = render(
      <FigureNote
        notes={[{ type: 'p', children: [{ text: 'This is a note' }] }]}
      />,
    );

    const triggerButton = screen.getByText('Note');
    expect(triggerButton).not.toHaveClass('open');

    fireEvent.click(container.querySelector('.popup-open'));
    expect(screen.getByText('Note')).toHaveClass('open');

    fireEvent.click(container.querySelector('.popup-close'));
    expect(screen.getByText('Note')).not.toHaveClass('open');
  });

  it('renders a fallback message when there are no notes', () => {
    const { container } = render(<FigureNote notes={[]} />);

    expect(container.querySelector('.figure-note')).toBeInTheDocument();
    expect(
      screen.getByText('There are no notes set for this visualization'),
    ).toBeInTheDocument();
  });

  it('serializeText handles string notes', () => {
    render(<div>{serializeText('Plain note')}</div>);

    expect(screen.getByText('Plain note')).toBeInTheDocument();
  });

  it('serializeText handles non-array, non-string notes', () => {
    render(<div>{serializeText(undefined)}</div>);

    expect(
      screen.getByText('There are no notes set for this visualization'),
    ).toBeInTheDocument();
  });
});
