
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { username: string; password: string }) => void;
}

const AdminLogin = ({ isOpen, onClose, onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate a slight delay for login
    setTimeout(() => {
      onLogin({ username, password });
      setLoading(false);
      // Don't clear credentials on failed login
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Admin Login</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Username
            </Label>
            <Input
              id="username"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-2 focus-visible:ring-primary"
              required
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 focus-visible:ring-primary"
              required
            />
          </div>
          
          <DialogFooter className="sm:justify-center">
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading || !username || !password}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </DialogFooter>
        </form>
        
        <div className="text-center text-xs text-muted-foreground mt-2">
          <p>Default admin credentials: username: <strong>admin</strong>, password: <strong>admin123</strong></p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;
