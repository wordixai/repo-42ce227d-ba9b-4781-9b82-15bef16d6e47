import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDocumentStore } from '@/stores/documentStore';

export const PresenceFacepile: React.FC = () => {
  const { currentUser, onlineUsers } = useDocumentStore();
  
  const allUsers = [currentUser, ...onlineUsers];
  const maxVisible = 5;
  const visibleUsers = allUsers.slice(0, maxVisible);
  const extraCount = Math.max(0, allUsers.length - maxVisible);

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          {allUsers.length} {allUsers.length === 1 ? 'person' : 'people'} viewing
        </span>
        <div className="flex -space-x-2">
          {visibleUsers.map((user, index) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <Avatar
                  className="h-8 w-8 border-2 border-background cursor-pointer"
                  style={{ zIndex: visibleUsers.length - index }}
                >
                  <AvatarFallback
                    className="text-xs font-medium text-white"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name} {user.id === currentUser.id ? '(you)' : ''}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {extraCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border-2 border-background cursor-pointer bg-muted">
                  <AvatarFallback className="text-xs font-medium">
                    +{extraCount}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{extraCount} more {extraCount === 1 ? 'person' : 'people'}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};