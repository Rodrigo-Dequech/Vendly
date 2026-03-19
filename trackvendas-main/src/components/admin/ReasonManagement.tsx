import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { apiGetLossReasons, apiCreateLossReason, apiDeleteLossReason } from "@/lib/api-service";
import { LossReason } from "@/lib/types";

export function ReasonManagement() {
  const [reasons, setReasons] = useState<LossReason[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [requiresNote, setRequiresNote] = useState(false);

  const loadData = async () => {
    setReasons(await apiGetLossReasons());
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async () => {
    if (!newLabel.trim()) {
      toast.error("Informe o nome do motivo.");
      return;
    }
    await apiCreateLossReason({ label: newLabel.trim(), requiresNote });
    toast.success("Motivo criado!");
    setNewLabel("");
    setRequiresNote(false);
    setDialogOpen(false);
    await loadData();
  };

  const handleDelete = async (r: LossReason) => {
    if (!confirm(`Excluir motivo "${r.label}"?`)) return;
    await apiDeleteLossReason(r.id);
    toast.success("Motivo excluído.");
    await loadData();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Motivos de Perda</h3>
          <p className="text-xs text-muted-foreground">{reasons.length} motivos cadastrados</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-accent text-accent-foreground">
              <Plus className="w-4 h-4 mr-1" /> Novo Motivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Motivo de Perda</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Nome do Motivo</Label>
                <Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Ex: Preço alto" />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={requiresNote} onCheckedChange={setRequiresNote} />
                <Label>Exige campo de observação</Label>
              </div>
              <Button onClick={handleCreate} className="w-full">Criar Motivo</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {reasons.map(r => (
          <div key={r.id} className="flex items-center gap-3 p-3 rounded-md border border-border bg-background">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              <ClipboardList className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-foreground">{r.label}</span>
              {r.requiresNote && (
                <p className="text-[10px] text-muted-foreground">Exige observação</p>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(r)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
