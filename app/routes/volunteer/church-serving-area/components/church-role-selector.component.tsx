import type { ChurchRole } from '../types';
import { ChurchRoleCard } from './church-role-card.component';

export function ChurchRoleSelector({
  roles,
  selectedRoleId,
  onSelect,
}: {
  roles: ChurchRole[];
  selectedRoleId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      role='radiogroup'
      aria-label='Choose a serving role'
      className='flex flex-col gap-4'
    >
      {roles.map((role) => (
        <ChurchRoleCard
          key={role.id}
          role={role}
          selected={selectedRoleId === role.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
