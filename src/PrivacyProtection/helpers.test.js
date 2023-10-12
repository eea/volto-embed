import { createImageUrl } from './helpers';
import '@testing-library/jest-dom/extend-expect';

global.window.atob = jest.fn();

global.URL.createObjectURL = jest.fn(() => 'mocked-url');

describe('createImageUrl', () => {
  it('should return a valid image URL', () => {
    const result = {
      data: 'VGhpcyBpcyBhIGJhc2U2NCBlbmNvZGluZyB0byBkZWNvZGU=',
      'content-type': 'image/jpeg',
    };
    global.window.atob.mockReturnValue('This is a base64 encoding to decode');
    const imageUrl = createImageUrl(result);

    expect(typeof imageUrl).toBe('string');
  });
});
