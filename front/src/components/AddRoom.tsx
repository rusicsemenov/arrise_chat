import { FormEvent, useEffect, useRef, useState } from 'react';
import { useSocketContext } from './SocketProvider.tsx';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';

const AddRoom = () => {
    const [isOpen, setIsOpen] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const { wsClient } = useSocketContext();

    useEffect(() => {
        nameInputRef.current?.focus();
    }, [isOpen]);

    const onFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form['room-name'] as HTMLInputElement).value.trim();
        const description = (form['room-description'] as HTMLTextAreaElement).value.trim();

        if (!name) {
            return toast("Room name can''t be empty", { type: 'error' });
        }

        if (name.length > 20) {
            return toast('Room name must be less than 20 characters', { type: 'error' });
        }

        if (description.length > 200) {
            return toast('Room description must be less than 200 characters', { type: 'error' });
        }

        wsClient?.send('MESSAGE', {
            type: 'CREATE_ROOM',
            payload: { name, description },
        });
        setIsOpen(false);
    };

    return (
        <>
            <button className="btn ml-auto" onClick={() => setIsOpen(true)}>
                Create New Room
            </button>
            {Boolean(isOpen && typeof document !== 'undefined')
                && createPortal(
                      <div className="modal">
                          <div className="modal-content">
                              <h2>Create New Room</h2>
                              <form onSubmit={onFormSubmit} className="flex-column gap-2">
                                  <label htmlFor="room-name">Room Name</label>
                                  <input type="text" id="room-name" required ref={nameInputRef} />

                                  <label htmlFor="room-description">Room Description</label>
                                  <textarea id="room-description"></textarea>

                                  <div className="flex gap-2 justify-center">
                                      <button type="submit" className="btn w100">
                                          Create
                                      </button>
                                      <button
                                          type="button"
                                          className="btn secondary"
                                          onClick={() => setIsOpen(false)}
                                      >
                                          Cancel
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>,
                      document.body,
                  )}
        </>
    );
};

export default AddRoom;
