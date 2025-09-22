import React, { useState } from 'react';
import { Search, Plus, FileText, Lock, Globe, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDocumentStore } from '@/stores/documentStore';
import { cn } from '@/lib/utils';

export const DocumentSidebar: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    currentDocument,
    setCurrentDocument,
    createDocument,
    deleteDocument,
    getPublicDocuments,
    getPrivateDocuments
  } = useDocumentStore();

  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocIsPublic, setNewDocIsPublic] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const publicDocuments = getPublicDocuments();
  const privateDocuments = getPrivateDocuments();

  const handleCreateDocument = () => {
    if (newDocTitle.trim()) {
      const doc = createDocument(newDocTitle.trim(), newDocIsPublic);
      setCurrentDocument(doc);
      setNewDocTitle('');
      setNewDocIsPublic(false);
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteDocument = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    deleteDocument(docId);
  };

  const DocumentItem = ({ document, showDelete = false }: { document: any, showDelete?: boolean }) => (
    <div
      key={document.id}
      className={cn(
        "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-accent",
        currentDocument?.id === document.id && "bg-accent"
      )}
      onClick={() => setCurrentDocument(document)}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          {document.isPublic ? (
            <Globe className="h-4 w-4 text-blue-500" />
          ) : (
            <Lock className="h-4 w-4 text-gray-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {document.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(document.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {showDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
          onClick={(e) => handleDeleteDocument(e, document.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-sidebar-foreground">CollabDocs</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    placeholder="Enter document title..."
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={newDocIsPublic}
                    onCheckedChange={setNewDocIsPublic}
                  />
                  <Label htmlFor="public">Make document public</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDocument} disabled={!newDocTitle.trim()}>
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Document Lists */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Public Documents */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Globe className="h-4 w-4 text-blue-500" />
              <h2 className="text-sm font-medium text-sidebar-foreground">Public Documents</h2>
              <span className="text-xs text-muted-foreground">({publicDocuments.length})</span>
            </div>
            <div className="space-y-1">
              {publicDocuments.length > 0 ? (
                publicDocuments.map((doc) => (
                  <DocumentItem key={doc.id} document={doc} />
                ))
              ) : (
                <p className="text-xs text-muted-foreground px-3 py-2">No public documents found</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Private Documents */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Lock className="h-4 w-4 text-gray-500" />
              <h2 className="text-sm font-medium text-sidebar-foreground">My Documents</h2>
              <span className="text-xs text-muted-foreground">({privateDocuments.length})</span>
            </div>
            <div className="space-y-1">
              {privateDocuments.length > 0 ? (
                privateDocuments.map((doc) => (
                  <DocumentItem key={doc.id} document={doc} showDelete />
                ))
              ) : (
                <p className="text-xs text-muted-foreground px-3 py-2">No private documents found</p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};