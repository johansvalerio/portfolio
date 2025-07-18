// Mock de session
export const mockSession = {
  user: {
    id: String(1),
    name: "Johans Valerio".substring(0, 2).toUpperCase(),
    email: "johans@example.com",
    image: "https://example.com/avatar.jpg",
    role: Number(1),
  },
  expires: (Date.now() + 30 * 60 * 1000).toString(),
  authenticated: true,
  //expires: (Date.now() / 1000 + 5).toString(), // Timestamp Unix que expira en 5 segundos
};