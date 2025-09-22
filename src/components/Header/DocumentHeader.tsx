import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Globe, Lock, Edit2, Check, X } from 'lucide-react';
import { useDocumentStore } from '@/stores/documentStore';
import { PresenceFacepile } from '@/components/Presence/PresenceFacepile';

export const DocumentHeader: React.FC = () => {
  const { currentDocument, updateDocument } = useDocumentStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  if (!currentDocument) {
    return (
      <div className="h-16 border-b border-border bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Select a document to start editing</p>
      </div>
    );
  }

  const handleStartEdit = () => {
    setEditTitle(currentDocument.title);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateDocument(currentDocument.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle('');
    setIsEditing(false);
  };

  const handleTogglePublic = (isPublic: boolean) => {
    updateDocument(currentDocument.id, { isPublic });
  };

  return (
    <div className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        {/* Document Title */}
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-8 text-lg font-semibold"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-foreground">
                {currentDocument.title}
              </h1>
              <Button size="sm" variant="ghost" onClick={handleStartEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {currentDocument.isPublic ? (
              <Globe className="h-4 w-4 text-blue-500" />
            ) : (
              <Lock className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <Switch
            checked={currentDocument.isPublic}
            onCheckedChange={handleTogglePublic}
            id="visibility"
          />
          <Label htmlFor="visibility" className="text-sm">
            {currentDocument.isPublic ? 'Public' : 'Private'}
          </Label>
        </div>
      </div>

      {/* Presence Facepile */}
      <PresenceFacepile />
    </div>
  );
};