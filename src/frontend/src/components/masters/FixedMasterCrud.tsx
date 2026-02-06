import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type MasterItem = {
  id: string;
  name: string;
  created: bigint;
  lastUpdated: bigint;
};

type FixedMasterCrudProps = {
  title: string;
  description: string;
  items: MasterItem[];
  onCreate: (item: MasterItem) => Promise<void>;
  onUpdate: (id: string, item: MasterItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
};

export default function FixedMasterCrud({
  title,
  description,
  items,
  onCreate,
  onUpdate,
  onDelete,
  isLoading,
}: FixedMasterCrudProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterItem | null>(null);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenDialog = (item?: MasterItem) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
    } else {
      setEditingItem(null);
      setName('');
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSubmitting(true);
    try {
      const now = BigInt(Date.now() * 1000000);
      if (editingItem) {
        await onUpdate(editingItem.id, {
          ...editingItem,
          name: name.trim(),
          lastUpdated: now,
        });
        toast.success(`${title} updated successfully`);
      } else {
        await onCreate({
          id: crypto.randomUUID(),
          name: name.trim(),
          created: now,
          lastUpdated: now,
        });
        toast.success(`${title} created successfully`);
      }
      setDialogOpen(false);
      setName('');
      setEditingItem(null);
    } catch (error) {
      toast.error(`Failed to ${editingItem ? 'update' : 'create'} ${title.toLowerCase()}`);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return;

    try {
      await onDelete(id);
      toast.success(`${title} deleted successfully`);
    } catch (error) {
      toast.error(`Failed to delete ${title.toLowerCase()}`);
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add {title}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit' : 'Add'} {title}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={`Enter ${title.toLowerCase()} name`}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No {title.toLowerCase()}s found. Add one to get started.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
