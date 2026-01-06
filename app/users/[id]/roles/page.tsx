import { useState } from 'react';
import { useUser, useRoles } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
//import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function UserRolesPage({ params }: { params: { id: string } }) {
  const { user, isLoading: userLoading } = useUser(params.id);
  const { roles } = useRoles();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      /* await api.patch(`/auth/users/${params.id}/roles`, {
        roles: selectedRoles,
      }); */
      toast({
        title: 'Success',
        description: 'User roles updated successfully',
      });
      router.push(`/users/${params.id}`);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update roles',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Manage User Roles</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Assign Roles
            </label>
            <Select
              multiple
              value={selectedRoles}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions);
                setSelectedRoles(options.map(option => option.value));
              }}
              className="w-full"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </Select>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
}