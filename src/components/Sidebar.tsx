// --- START OF FILE src/components/Sidebar.tsx ---
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { Avatar, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { LinkIcon, MapPinIcon } from 'lucide-react';
import { getAuthUser, getAuthToken } from '@/actions/auth.action';

// Helper to fetch following stats since /auth/me might not return them
// You may need to create this endpoint in Python or update /auth/me
async function getUserStats(username: string) {
    // This is just a placeholder. You should ideally fetch this from backend
    // Or ensure getAuthUser returns _count
    return { followers: 0, following: 0 }; 
}

async function Sidebar() {
  const user = await getAuthUser();

  if (!user) return <UnAuthenticatedSidebar/>;

  // If your /auth/me endpoint doesn't return counts, you might need to fetch them separately
  // Assuming for now user object matches the UserOut schema from python
  
  return (
    <div className="sticky top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2 ">
                <AvatarImage src={user.image || "/avatar.png"} />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </Link>

            {user.bio && <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>}

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">0</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">0</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {user.location || "No location"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                {user.website ? (
                  <a href={`${user.website}`} className="hover:underline truncate" target="_blank">
                    {user.website}
                  </a>
                ) : (
                  "No website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Sidebar

const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">Welcome Back!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-4">
          Login to access your profile and connect with others.
        </p>
        <Button className="w-full" variant="outline" asChild>
            <Link href="/login">Login</Link>
        </Button>
        <Button className="w-full mt-2" variant="default" asChild>
            <Link href="/register">Sign Up</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);