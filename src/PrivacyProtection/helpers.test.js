import { createImageUrl } from './helpers';

describe('createImageUrl', () => {
  it('should create a valid image URL from the base64 encoded data', () => {
    // Mock data for the test
    const mockResult = {
      data: 'aGVsbG8gd29ybGQ=', // "hello world" in base64
      'content-type': 'image/png',
    };

    // Mock the atob function
    jest.spyOn(window, 'atob').mockImplementation(() => 'hello world');

    // Mock the URL.createObjectURL function
    const mockUrl = 'blob:http://localhost:3000/some-url';
    global.URL.createObjectURL = jest.fn().mockReturnValue(mockUrl);

    // Call the function
    const imageUrl = createImageUrl(mockResult);

    // Assertions
    expect(window.atob).toHaveBeenCalledWith(mockResult.data);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(imageUrl).toBe(mockUrl);

    // Verify the Blob creation
    const blobArgs = URL.createObjectURL.mock.calls[0][0];
    expect(blobArgs.type).toBe(mockResult['content-type']);
    expect(blobArgs.size).toBe(11); // "hello world" is 11 bytes

    // Clean up mocks
    jest.restoreAllMocks();
  });
});
