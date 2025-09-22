import React, { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useDocumentStore } from '@/stores/documentStore';

interface CollaborativeEditorProps {
  documentId: string;
}

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ documentId }) => {
  const { currentUser, updateDocument, addOnlineUser, removeOnlineUser } = useDocumentStore();
  const yDocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: yDocRef.current,
      }),
      CollaborationCursor.configure({
        provider: providerRef.current,
        user: {
          name: currentUser.name,
          color: currentUser.color,
        },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'editor-content',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateDocument(documentId, { content: html });
    },
  });

  useEffect(() => {
    // Initialize Yjs document and WebSocket provider
    yDocRef.current = new Y.Doc();
    
    // For demo purposes, we'll simulate a WebSocket connection
    // In a real app, you'd connect to your WebSocket server
    const simulateCollaboration = () => {
      // Simulate other users joining/leaving
      const otherUsers = [
        { id: '2', name: 'John Doe', color: '#FF6B6B' },
        { id: '3', name: 'Jane Smith', color: '#4ECDC4' },
      ];

      // Add some users
      setTimeout(() => {
        otherUsers.forEach(user => addOnlineUser(user));
      }, 1000);

      // Remove users after some time
      setTimeout(() => {
        otherUsers.forEach(user => removeOnlineUser(user.id));
      }, 10000);
    };

    simulateCollaboration();

    return () => {
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (yDocRef.current) {
        yDocRef.current.destroy();
      }
    };
  }, [documentId, addOnlineUser, removeOnlineUser]);

  useEffect(() => {
    if (editor && yDocRef.current) {
      // Reconfigure collaboration with new document
      editor.commands.setContent('');
    }
  }, [editor, documentId]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
};