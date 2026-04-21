"use client";

import React, { useState } from 'react';
import { MoreVertical, Shield, User as UserIcon, Plus, Mail, Trash2, Edit2, RotateCcw } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { User } from '@/types';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { UserFormModal } from './UserFormModal';
import { notify } from '@/lib/toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const { hasPermission } = useAuthStore();
  const router = useRouter();
  
  // React Query Hooks
  const { data, isLoading, isError, refetch } = useUsers({ page });
  const deleteUser = useDeleteUser();

  if (!hasPermission('manage_users') && !hasPermission('Super Admin')) {
    if (typeof window !== 'undefined') router.push('/admin');
    return null;
  }

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteUser.mutateAsync(id);
        notify.success("User deleted successfully.");
      } catch (err: any) {
        notify.error("Failed to delete user", err.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-10 w-28 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <LoadingSkeleton variant="table" count={5} />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Failed to load users"
        description="There was a problem fetching the user list."
        icon={RotateCcw}
        action={{ label: "Try Again", onClick: () => refetch() }}
      />
    );
  }

  const users = data?.data || [];
  const meta = data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Users & Roles</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            A list of all users in the system including their roles and permissions.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-400 text-white border-0">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-zinc-300 dark:ring-zinc-800 rounded-2xl">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100 sm:pl-6">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Role</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Permissions</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-100">Joined</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                  {users.map((person: User) => (
                    <tr key={person.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-zinc-900 dark:text-white">{person.name}</div>
                            <div className="text-zinc-500 flex items-center gap-1 mt-0.5"><Mail className="h-3 w-3" /> {person.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500">
                        {person.roles?.map((r: any) => {
                          const roleName = typeof r === 'string' ? r : r.name;
                          return (
                            <span key={roleName} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 mr-1">
                              {roleName === 'Super Admin' && <Shield className="h-3 w-3" />}
                              {roleName}
                            </span>
                          );
                        })}
                      </td>
                      <td className="px-3 py-4 text-sm text-zinc-500 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {person.permissions && person.permissions.length > 0 ? person.permissions.map((p: any) => {
                            const permName = typeof p === 'string' ? p : p.name;
                            return (
                              <span key={permName} className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                {permName.replace('manage_', '')}
                              </span>
                            );
                          }) : (
                            <span className="text-zinc-400 italic">Default</span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                        {person.redirect_path || "N/A"}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(person)}>
                              <Edit2 className="h-4 w-4 mr-2" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(person.id)} className="text-red-500 focus:text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                     <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-500">No users found.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between mt-6 px-4">
                <Button 
                  variant="outline" 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {meta.last_page}
                </span>
                <Button 
                  variant="outline" 
                  disabled={page === meta.last_page}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <UserFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
