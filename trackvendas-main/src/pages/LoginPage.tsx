import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingDown, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success("Login realizado com sucesso!");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingDown className="w-8 h-8 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">TrackVendas</h1>
          <p className="text-sm text-muted-foreground mt-1">Controle de perda de vendas</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(false); }}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="????????????????????????"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              className="h-12"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Email n??o encontrado. Tente novamente.</span>
            </div>
          )}

          <Button type="submit" className="w-full h-12 gradient-accent text-accent-foreground font-semibold text-base">
            Entrar
          </Button>
        </form>

        {/* Demo accounts */}
        <div className="mt-8 p-4 bg-card rounded-lg border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-3">Contas de demonstra????o:</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendedor:</span>
              <button onClick={() => setEmail("carlos@loja.com")} className="text-accent font-medium hover:underline">carlos@loja.com</button>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gerente:</span>
              <button onClick={() => setEmail("ana@loja.com")} className="text-accent font-medium hover:underline">ana@loja.com</button>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dono:</span>
              <button onClick={() => setEmail("roberto@loja.com")} className="text-accent font-medium hover:underline">roberto@loja.com</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
