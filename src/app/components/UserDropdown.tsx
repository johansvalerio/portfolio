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
import { Badge } from "@/components/ui/badge";
import { LogOut, LightbulbIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import useMessageStore from "@/lib/messageStore";
import { useEffect } from "react";
import { useSocketHandler } from "@/app/hooks/useSocketMessage";

export default function UserDropdown({ session }: { session: Session | null }) {
  const router = useRouter();
  const fetchMessages = useMessageStore((state) => state.fetchMessages);
  const cantResponseNotSeen = useMessageStore((state) =>
    state.cantResponseNotSeen()
  );
  const cantMessageNotSeen = useMessageStore((state) =>
    state.cantMessageNotSeen()
  );
  const userRole = session?.user?.role !== 1;
  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image || "";

  const handleSignOut = async () => {
    try {
      console.log("handleSignOut called");
      await signOut({ redirect: false });
      router.refresh();
      // Eliminar el mensaje de bienvenida del localStorage
      localStorage.removeItem("welcomeShown");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Agregar este efecto para depuración
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useSocketHandler(session);

  if (!session) return null;

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
          {userRole && cantResponseNotSeen > 0 && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-1 rounded-full bg-red-500 text-white"
            >
              {cantResponseNotSeen}
            </Badge>
          )}
          {!userRole && cantMessageNotSeen > 0 && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-1 rounded-full bg-red-500 text-white"
            >
              {cantMessageNotSeen}
            </Badge>
          )}
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
          <span className="text-sm font-medium mr-2">Mis ideas</span>
          {userRole && cantResponseNotSeen > 0 && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-1 rounded-full bg-red-500 text-white"
            >
              {cantResponseNotSeen}
            </Badge>
          )}
          {!userRole && cantMessageNotSeen > 0 && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-1 rounded-full bg-red-500 text-white"
            >
              {cantMessageNotSeen}
            </Badge>
          )}
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
