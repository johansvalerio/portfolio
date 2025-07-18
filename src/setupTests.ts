import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn().mockImplementation((url) => {
  if (url === "/api/auth/csrf") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ csrfToken: "mock-csrf-token" }),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});