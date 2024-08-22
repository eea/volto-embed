import { preview_image } from './preview_image';
describe('preview_image middleware', () => {
  let store;
  let next;
  let action;
  let middlewares;

  beforeEach(() => {
    store = {
      getState: jest.fn(() => ({
        content: {
          data: {
            '@type': 'map_interactive',
            preview_image: 'existing_image.png',
            preview_image_saved: false,
          },
        },
      })),
    };
    next = jest.fn();
    middlewares = [];
  });

  it('existing image', () => {
    action = { type: 'UPDATE_CONTENT', request: { data: {} } };
    const middleware = preview_image(middlewares)[0]; // Accesăm prima funcție din array
    middleware(store)(next)(action); // Executăm funcția de middleware
    expect(next).toHaveBeenCalledWith(action); // Verificăm că funcția next a fost apelată cu acțiunea originală
  });
  it('redo the image', () => {
    store = {
      getState: jest.fn(() => ({
        content: {
          data: {
            '@type': 'map_interactive',
            preview_image: 'preview_image_generated_map_interactive.png',
            preview_image_saved: false,
          },
        },
      })),
    };
    next = jest.fn();
    middlewares = [];
    action = { type: 'UPDATE_CONTENT', request: { data: {} } };
    const middleware = preview_image(middlewares)[0]; // Accesăm prima funcție din array
    middleware(store)(next)(action); // Executăm funcția de middleware
    expect(next).toHaveBeenCalledWith(action); // Verificăm că funcția next a fost apelată cu acțiunea originală
  });
});
