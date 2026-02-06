import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { MasterList, MasterListItem } from '../../backend';

type MasterListEditorProps = {
  masterLists: MasterList[];
  onCreate: (masterList: MasterList) => Promise<void>;
  onUpdate: (id: string, masterList: MasterList) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
};

export default function MasterListEditor({ masterLists, onCreate, onUpdate, onDelete, isLoading }: MasterListEditorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<MasterList | null>(null);
  const [listName, setListName] = useState('');
  const [items, setItems] = useState<MasterListItem[]>([]);
  const [newItemValue, setNewItemValue] = useState('');
  const [newItemLabel, setNewItemLabel] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenDialog = (list?: MasterList) => {
    if (list) {
      setEditingList(list);
      setListName(list.name);
      setItems([...list.items]);
    } else {
      setEditingList(null);
      setListName('');
      setItems([]);
    }
    setNewItemValue('');
    setNewItemLabel('');
    setDialogOpen(true);
  };

  const handleAddItem = () => {
    if (!newItemValue.trim() || !newItemLabel.trim()) {
      toast.error('Both value and label are required');
      return;
    }
    setItems([...items, { value: newItemValue.trim(), itemLabel: newItemLabel.trim() }]);
    setNewItemValue('');
    setNewItemLabel('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) {
      toast.error('List name is required');
      return;
    }

    setSubmitting(true);
    try {
      const now = BigInt(Date.now() * 1000000);
      if (editingList) {
        await onUpdate(editingList.id, {
          ...editingList,
          name: listName.trim(),
          items,
          lastUpdated: now,
        });
        toast.success('Master list updated successfully');
      } else {
        await onCreate({
          id: crypto.randomUUID(),
          name: listName.trim(),
          items,
          created: now,
          lastUpdated: now,
        });
        toast.success('Master list created successfully');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(`Failed to ${editingList ? 'update' : 'create'} master list`);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this master list?')) return;

    try {
      await onDelete(id);
      toast.success('Master list deleted successfully');
    } catch (error) {
      toast.error('Failed to delete master list');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User-Defined Master Lists</CardTitle>
            <CardDescription>Create custom master lists for use in forms</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Master List
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingList ? 'Edit' : 'Add'} Master List</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="listName">List Name</Label>
                    <Input
                      id="listName"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      placeholder="Enter list name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Items</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(e.target.value)}
                        placeholder="Value"
                      />
                      <Input
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        placeholder="Label"
                      />
                      <Button type="button" onClick={handleAddItem} size="sm">
                        Add
                      </Button>
                    </div>
                    {items.length > 0 && (
                      <div className="border rounded-md mt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Value</TableHead>
                              <TableHead>Label</TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.value}</TableCell>
                                <TableCell>{item.itemLabel}</TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveItem(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
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
        ) : masterLists.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No master lists found. Add one to get started.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {masterLists.map((list) => (
                <TableRow key={list.id}>
                  <TableCell>{list.name}</TableCell>
                  <TableCell>{list.items.length} items</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(list)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(list.id)}>
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
