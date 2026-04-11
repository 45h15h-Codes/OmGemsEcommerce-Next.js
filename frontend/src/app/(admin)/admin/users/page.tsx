"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';
import { MoreVertical, Shield, User as UserIcon, Plus, Mail } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  roles: { name: string }[];
  permissions: { name: string }[];
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasPermission('manage_users') && !hasPermission('Super Admin')) {
      // Prevent rendering and let middleware or parent handle redirect
      router.push('/admin');
      return;
    }

    async function fetchUsers() {
      try {
        const response = await apiClient.get('/api/admin/users');
        setUsers(response.data.data); // Assuming Laravel pagination
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [hasPermission, router]);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
      <div className="h-[400px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
    </div>;
  }

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
          <button
            type="button"
            className="block rounded-md bg-amber-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
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
                  {users?.map((person) => (
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
                        {person.roles.map(r => (
                          <span key={r.name} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                            {r.name === 'Super Admin' && <Shield className="h-3 w-3" />}
                            {r.name}
                          </span>
                        ))}
                      </td>
                      <td className="px-3 py-4 text-sm text-zinc-500 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {person.permissions.length > 0 ? person.permissions.map(p => (
                            <span key={p.name} className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                              {p.name.replace('manage_', '')}
                            </span>
                          )) : (
                            <span className="text-zinc-400 italic">Default</span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(person.created_at).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-zinc-400 hover:text-zinc-500 transition-colors">
                          <MoreVertical className="h-5 w-5" />
                          <span className="sr-only">, {person.name}</span>
                        </button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
