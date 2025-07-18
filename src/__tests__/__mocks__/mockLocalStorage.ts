// Mock localStorage
export default function mockLocalStorage() {
    const mock = {
        getItem: jest.fn().mockReturnValue("true"),
        removeItem: jest.fn(),
        setItem: jest.fn(),
    };
    Object.defineProperty(window, "localStorage", {
        value: mock,
        writable: true,
        configurable: true,
    });
}