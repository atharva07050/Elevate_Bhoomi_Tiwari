
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus, GraduationCap } from "lucide-react";
import { getLocalUser, saveLocalUser, setCurrentSession } from "@/lib/storage";
import { UserProfile } from "@/lib/types";

export default function Login({ onLogin }: { onLogin: (user: any, profile: UserProfile) => void }) {
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      let profile = getLocalUser(email);

      if (!profile) {
        profile = {
          overall: 0,
          skillScore: 0,
          communication: 0,
          problemSolving: 0,
          topSkills: [],
          areasForImprovement: [],
          testTaken: false,
          history: []
        };
        saveLocalUser(email, profile);
      }

      setCurrentSession(email);
      onLogin({ email, uid: email }, profile);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-card/90">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Jarvis Elevate</CardTitle>
          <CardDescription>
            Enter your email to access your local placement dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? "Accessing..." : "Enter Dashboard"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Data is saved locally in your browser. No Firebase needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
