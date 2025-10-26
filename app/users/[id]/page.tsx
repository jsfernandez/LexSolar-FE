import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoading, error } = useUser(params.id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-32 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <p className="text-red-500">Error: {error.message}</p>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <p>User not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Details</h1>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/users/${params.id}/edit`}>Edit User</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/users/${params.id}/roles`}>Manage Roles</Link>
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1">{user.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1">{user.email}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Role</h3>
            <p className="mt-1">{user.role}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Permissions</h3>
            <div className="mt-1">
              {user.permissions ? (
                <ul className="list-disc list-inside">
                  {user.permissions.map((permission) => (
                    <li key={permission}>{permission}</li>
                  ))}
                </ul>
              ) : (
                <p>No permissions assigned</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}