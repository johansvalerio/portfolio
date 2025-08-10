"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LightbulbIcon, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import useMessageStore from "@/lib/messageStore";
import { useEffect } from "react";
import { useSocketHandler } from "@/app/hooks/useSocketMessage";

export default function UserMobileDropdown({
  session,
}: {
  session: Session | null;
}) {
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
      await signOut({ redirect: false });
      router.refresh();
      // Eliminar el mensaje de bienvenida del localStorage
      localStorage.removeItem("welcomeShown");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Agregar este efecto para el socket
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useSocketHandler(session);

  if (!session) return null;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 ">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{userName}</span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive/90"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4">
        <a
          className="flex items-center justify-between px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          href="/misIdeas"
        >
          <div className="flex items-center gap-2">
            <LightbulbIcon className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Mis ideas</span>
          </div>
          {userRole && cantResponseNotSeen > 0 && (
            <Badge
              variant="outline"
              className="text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse"
            >
              Nuevo
            </Badge>
          )}
          {!userRole && cantMessageNotSeen > 0 && (
            <Badge
              variant="outline"
              className="text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse"
            >
              Nuevo
            </Badge>
          )}
        </a>
      </div>
    </>
  );
}
