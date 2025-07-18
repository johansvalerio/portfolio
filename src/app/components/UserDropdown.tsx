"use client";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, LightbulbIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

export default function UserDropdown({ session }: { session: Session | null }) {
  if (!session) return null;

  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image || "";

  const handleSignOut = async () => {
    try {
      console.log("handleSignOut called");
      console.log("signOut es:", signOut);
      await signOut({ redirect: false });
      // Eliminar el mensaje de bienvenida del localStorage
      localStorage.removeItem("welcomeShown");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          data-testid="user-dropdown-menu"
          className="h-9 w-9 cursor-pointer border border-border hover:opacity-80 transition-opacity"
        >
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" role="menu">
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          role="menuitem"
          onClick={() => redirect("/misIdeas")}
          className="cursor-pointer"
        >
          <LightbulbIcon className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Mis ideas</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          role="menuitem"
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className=" h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
