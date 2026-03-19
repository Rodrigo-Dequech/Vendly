import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, StoreIcon, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import {
  apiGetStores,
  apiGetUsers,
  apiCreateStore,
  apiUpdateStore,
  apiDeleteStore,
  CreateStorePayload,
} from "@/lib/api-service";
import { Store, User } from "@/lib/types";

interface Props {
  filterStoreId?: string;
}

export function StoreManagement({ filterStoreId }: Props) {
  const [stores, setStores] = useState<Store[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [form, setForm] = useState<CreateStorePayload>({ name: "", managerId: "" });

  const loadData = async () => {
    const [s, u] = await Promise.all([apiGetStores(), apiGetUsers()]);
    setStores(filterStoreId ? s.filter(st => st.id === filterStoreId) : s);
    setManagers(u.filter(usr => usr.role === "gerente"));
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditingStore(null);
    setForm({ name: "", managerId: managers[0]?.id ?? "" });
    setDialogOpen(true);
  };

  const openEdit = (s: Store) => {
    setEditingStore(s);
    setForm({ name: s.name, managerId: s.managerId });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Preencha o nome da loja.");
      return;
    }
    if (editingStore) {
      await apiUpdateStore(editingStore.id, form);
      toast.success("Loja atualizada!");
    } else {
      await apiCreateStore(form);
      toast.success("Loja criada!");
    }
    await loadData();
    setDialogOpen(false);
  };

  const handleToggleActive = async (s: Store) => {
    await apiUpdateStore(s.id, { active: !s.active });
    toast.success(s.active ? "Loja desativada." : "Loja ativada.");
    await loadData();
  };

  const handleDelete = async (s: Store) => {
    if (!confirm(`Tem certeza que deseja excluir ${s.name}?`)) return;
    await apiDeleteStore(s.id);
    toast.success("Loja excluída.");
    await loadData();
  };

  const getManagerName = (id: string) => managers.find(m => m.id === id)?.name ?? "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Gestão de Lojas</h3>
          <p className="text-xs text-muted-foreground">{stores.length} lojas cadastradas</p>
        </div>
        {!filterStoreId && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openCreate} className="gradient-accent text-accent-foreground">
                <Plus className="w-4 h-4 mr-1" /> Nova Loja
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingStore ? "Editar Loja" : "Nova Loja"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Nome da Loja</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Gerente Responsável</Label>
                  <Select value={form.managerId} onValueChange={v => setForm({ ...form, managerId: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {managers.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingStore ? "Salvar Alterações" : "Criar Loja"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-2">
        {stores.map(s => (
          <div
            key={s.id}
            className={`flex items-center gap-3 p-3 rounded-md border border-border bg-background ${!s.active ? "opacity-50" : ""}`}
          >
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <StoreIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{s.name}</span>
                {!s.active && <Badge variant="destructive" className="text-[10px]">Inativa</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">Gerente: {getManagerName(s.managerId)}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(s)}>
                {s.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
              </Button>
              {!filterStoreId && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(s)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
