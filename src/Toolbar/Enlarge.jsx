import React, { useState } from 'react';
import { isFunction } from 'lodash';
import { Modal } from 'semantic-ui-react';
import cx from 'classnames';

const Enlarge = ({ children, className, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="enlarge">
      <button
        className="trigger-button"
        onClick={() => {
          if (isFunction(onClick)) {
            onClick({ setOpen: setIsOpen });
          } else {
            setIsOpen(true);
          }
        }}
      >
        <i className="ri-fullscreen-line" />
        Enlarge
      </button>
      {children && (
        <Modal
          open={isOpen}
          closeIcon={
            <span className="close icon">
              <i className="ri-close-line" />
            </span>
          }
          onClose={() => setIsOpen(false)}
          className={cx('enlarge-modal', className)}
        >
          <Modal.Content>{children}</Modal.Content>
        </Modal>
      )}
    </div>
  );
};

export default Enlarge;
