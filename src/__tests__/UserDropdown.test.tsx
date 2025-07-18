import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, beforeEach, it, expect, jest } from "@jest/globals";
import mockLocalStorage from "./__mocks__/mockLocalStorage";
import { mockSignOut } from "./__mocks__/mockSignOut";
import { mockSession } from "./__mocks__/mockUserSession";
import UserDropdown from "@/app/components/UserDropdown";

describe("UserDropdown", () => {
  // Resetear los mocks y configurar localStorage antes de cada test
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    // Mock localStorage
    mockLocalStorage();
    // Mock signOut
    mockSignOut();
  });

  //test 1
  it("renders user avatar with correct initials", () => {
    render(<UserDropdown session={mockSession} />);
    const avatarFallback = screen.getByText("JO");
    expect(avatarFallback).toBeTruthy();
  });

  // //test 2
  it("shows dropdown menu when avatar is clicked", async () => {
    const user = userEvent.setup();

    render(<UserDropdown session={mockSession} />);

    // 1. Encuentra el avatar
    const avatar = screen.getByTestId("user-dropdown-menu");

    // 2. Haz clic usando user-event (más realista)
    await user.click(avatar);

    // 3. Esperar a que el menú aparezca

    const menuContainer = await screen.findByRole("menu");
    expect(menuContainer).toBeTruthy();

    // 4. Verificar los elementos del menú
    const menuItems = await screen.findAllByRole("menuitem");
    expect(menuItems).toBeTruthy();

    // 5. Verificar el contenido
    const [misIdeas, cerrarSesion] = menuItems;
    expect(misIdeas).toBeTruthy();
    expect(cerrarSesion).toBeTruthy();
  });

  //test 3
  it("calls signOut when sign out button is clicked", async () => {
    // Renderizar el componente con la sesión
    render(<UserDropdown session={mockSession} />);

    // Simular el usuario haciendo clicks
    const user = userEvent.setup();

    // 1. Encuentra el avatar
    const avatar = screen.getByTestId("user-dropdown-menu");

    // 2. Haz clic para abrir el dropdown
    await user.click(avatar);

    // 3. Esperar a que el menú aparezca
    const cerrarSesion = screen.getByText("Cerrar sesión");
    console.log("Nodo cerrarSesion:", cerrarSesion);
    await user.click(cerrarSesion);

    // 4. Verificar que signOut fue llamado correctamente
    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });

    // 5. Verificar que localStorage.removeItem fue llamado
    expect(localStorage.removeItem).toHaveBeenCalledWith("welcomeShown");
  });
});
