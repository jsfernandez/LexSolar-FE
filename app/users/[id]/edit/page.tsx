import { useUser, useUpdateUser } from '@/hooks/useUser';
import { UserForm } from '@/components/UserForm';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditUserPage({ params }: { params: { id: string } }) {
  const { user, isLoading, error } = useUser(params.id);
  const { updateUser } = useUpdateUser(params.id);

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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <UserForm 
        initialData={user || undefined}
        onSubmit={updateUser}
      />
    </div>
  );
}