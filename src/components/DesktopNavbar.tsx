// --- START OF FILE src/components/DesktopNavbar.tsx ---
import { BellIcon, HomeIcon, UserIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ModeToggle from "./ModeToggle";
import { getAuthUser, logoutUser } from "@/actions/auth.action";

async function DesktopNavbar() {
  const user = await getAuthUser();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {user ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/notifications">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href={`/profile/${user.username}`}>
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <form action={logoutUser}>
            <Button variant="ghost" className="flex items-center gap-2">
                <LogOutIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Logout</span>
            </Button>
          </form>
        </>
      ) : (
        <Button variant="default" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      )}
    </div>
  );
}
export default DesktopNavbar;