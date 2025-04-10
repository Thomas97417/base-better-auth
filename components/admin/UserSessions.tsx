"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { AlertCircle, Clock, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface UserSessionsProps {
  userId: string;
}

interface Session {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export default function UserSessions({ userId }: UserSessionsProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);

        const response = await authClient.admin.listUserSessions({
          userId: userId,
        });

        if (response?.data) {
          setSessions(response.data.sessions as Session[]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch sessions")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [userId]);

  if (isLoading) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading user sessions...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load sessions: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              No active sessions found for this user
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Last active: {new Date(session.updatedAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Expires: {new Date(session.expiresAt).toLocaleString()}
                </p>
                {session.ipAddress && (
                  <p className="text-xs text-muted-foreground">
                    IP: {session.ipAddress}
                  </p>
                )}
                {session.userAgent && (
                  <p className="text-xs text-muted-foreground">
                    Device: {session.userAgent}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
