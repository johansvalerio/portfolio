import * as nextAuth from "next-auth/react";
// Mock next-auth
export const mockSignOut = jest.fn().mockResolvedValue(undefined);
jest.spyOn(nextAuth, "signOut").mockImplementation(mockSignOut);
jest.mock("next-auth/react", () => ({
  __esModule: true,
  signOut: (...args: any[]) => {
    console.log("MOCK SIGNOUT CALLED", args);
    return mockSignOut(...args);
  },
  redirect: jest.fn(),
}));