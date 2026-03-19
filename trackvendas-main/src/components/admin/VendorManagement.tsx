import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";
import {
  apiGetUsers,
  apiGetStores,
  apiCreateUser,
  apiUpdateUser,
  apiDeleteUser,
  CreateUserPayload,
} from "@/lib/api-service";
import { User, Store, UserRole } from "@/lib/types";

interface Props {
  /** If set, only show vendors for this store (manager view) */
  filterStoreId?: string;
  canManageManagers?: boolean;
}

export function VendorManagement({ filterStoreId, canManageManagers = false }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<CreateUserPayload>({ name: "", email: "", role: "vendedor", storeId: "" });

  const loadData = async () => {
    const [u, s] = await Promise.all([apiGetUsers(), apiGetStores()]);
    setUsers(u);
    setStores(s);
  };

  useEffect(() => { loadData(); }, []);

  const filteredUsers = users.filter(u => {
    if (filterStoreId && u.storeId !== filterStoreId) return false;
    if (!canManageManagers && u.role === "dono") return false;
    if (!canManageManagers && u.role === "gerente") return false;
    return true;
  });

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", role: "vendedor", storeId: filterStoreId || (stores[0]?.id ?? "") });
    setDialogOpen(true);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setForm({ name: u.name, email: u.email, role: u.role, storeId: u.storeId });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.storeId) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (editingUser) {
      await apiUpdateUser(editingUser.id, form);
      toast.success("Usuário atualizado!");
    } else {
      await apiCreateUser(form);
      toast.success("Usuário criado!");
    }
    await loadData();
    setDialogOpen(false);
  };

  const handleToggleActive = async (u: User) => {
    await apiUpdateUser(u.id, { active: !(u.active !== false) });
    toast.success(u.active !== false ? "Usuário desativado." : "Usuário ativado.");
    await loadData();
  };

  const handleDelete = async (u: User) => {
    if (!confirm(`Tem certeza que deseja excluir ${u.name}?`)) return;
    await apiDeleteUser(u.id);
    toast.success("Usuário excluído.");
    await loadData();
  };

  const getStoreName = (storeId: string) => stores.find(s => s.id === storeId)?.name ?? "—";

  const roleLabels: Record<string, string> = {
    vendedor: "Vendedor",
    gerente: "Gerente",
    dono: "Administrador",
  };

  const availableRoles: UserRole[] = canManageManagers
    ? ["vendedor", "gerente"]
    : ["vendedor"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Gestão de Vendedores</h3>
          <p className="text-xs text-muted-foreground">{filteredUsers.length} usuários cadastrados</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate} className="gradient-accent text-accent-foreground">
              <Plus className="w-4 h-4 mr-1" /> Novo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Perfil</Label>
                <Select value={form.role} onValueChange={(v: UserRole) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(r => (
                      <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Loja</Label>
                <Select value={form.storeId} onValueChange={v => setForm({ ...form, storeId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {stores.filter(s => !filterStoreId || s.id === filterStoreId).map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!editingUser && (
                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input type="password" placeholder="Senha inicial" onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
              )}
              <Button onClick={handleSave} className="w-full">
                {editingUser ? "Salvar Alterações" : "Criar Usuário"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {filteredUsers.map(u => (
          <div
            key={u.id}
            className={`flex items-center gap-3 p-3 rounded-md border border-border bg-background ${u.active === false ? "opacity-50" : ""}`}
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">{u.name}</span>
                <Badge variant={u.active === false ? "outline" : "secondary"} className="text-[10px]">
                  {roleLabels[u.role]}
                </Badge>
                {u.active === false && (
                  <Badge variant="destructive" className="text-[10px]">Inativo</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{u.email} · {getStoreName(u.storeId)}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(u)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(u)}>
                {u.active !== false ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(u)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}
