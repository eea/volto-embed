import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Share from './Share';
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

describe('Share', () => {
  it('opens and closes the popup through the trigger', () => {
    const { container } = render(<Share href="/path/to/embeded/content" />);

    const triggerButton = container.querySelector('.trigger-button');
    expect(triggerButton).not.toHaveClass('open');

    fireEvent.click(container.querySelector('.popup-open'));
    expect(container.querySelector('.trigger-button')).toHaveClass('open');

    fireEvent.click(container.querySelector('.popup-close'));
    expect(container.querySelector('.trigger-button')).not.toHaveClass('open');
  });
});
