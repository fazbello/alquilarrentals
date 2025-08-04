import React, { useState, useEffect } from 'react';
import { EmailTemplate } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminManageTemplates() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    const data = await EmailTemplate.list();
    setTemplates(data);
    setIsLoading(false);
  };

  const handleEdit = (template) => {
    setCurrentTemplate(template);
    setShowDialog(true);
  };

  const handleCreate = () => {
    setCurrentTemplate({ name: '', subject: '', body: '', description: '' });
    setShowDialog(true);
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await EmailTemplate.delete(templateId);
      loadTemplates();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (currentTemplate.id) {
      await EmailTemplate.update(currentTemplate.id, currentTemplate);
    } else {
      await EmailTemplate.create(currentTemplate);
    }
    setIsSaving(false);
    setShowDialog(false);
    loadTemplates();
  };

  return (
    <div className="p-4 md:p-8">
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Email Templates</CardTitle>
          <Button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-600 text-black">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-white/10">
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Subject</TableHead>
                <TableHead className="text-white">Description</TableHead>
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map(template => (
                <TableRow key={template.id} className="border-b-white/10">
                  <TableCell className="text-white font-medium">{template.name}</TableCell>
                  <TableCell className="text-slate-300">{template.subject}</TableCell>
                  <TableCell className="text-slate-400">{template.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                      <Edit className="w-4 h-4 text-amber-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(template.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{currentTemplate?.id ? 'Edit' : 'Create'} Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-slate-400">Template Name</Label>
              <Input
                placeholder="e.g., welcome-email"
                value={currentTemplate?.name || ''}
                onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">Description</Label>
              <Input
                placeholder="What this email is for"
                value={currentTemplate?.description || ''}
                onChange={(e) => setCurrentTemplate({...currentTemplate, description: e.target.value})}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">Subject</Label>
              <Input
                placeholder="Email Subject Line"
                value={currentTemplate?.subject || ''}
                onChange={(e) => setCurrentTemplate({...currentTemplate, subject: e.target.value})}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-400">Body (HTML)</Label>
              <Textarea
                placeholder="<p>Hi {{name}},</p><p>Welcome to our service!</p>"
                value={currentTemplate?.body || ''}
                onChange={(e) => setCurrentTemplate({...currentTemplate, body: e.target.value})}
                className="bg-white/5 border-white/10 text-white h-48"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-amber-500 hover:bg-amber-600 text-black">
              {isSaving ? 'Saving...' : 'Save Template'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}