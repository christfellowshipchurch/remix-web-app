/** THROWAWAY SPIKE CODE — see docs/architecture/spike-brief-manage-group-members.md */

export interface SpikeGroupMember {
  groupMemberId: number;
  personId: number;
  name: string;
  email: string;
  roleName: string;
  isLeader: boolean;
  /** Rock returns this as an integer: 0=Inactive, 1=Active, 2=Pending */
  status: number;
}

export interface SpikeLoaderData {
  groupId: number;
  /** The caller's own leadership row, proving the gate passed */
  leadership: {
    groupMemberId: number;
    groupRoleId: number;
  };
  members: SpikeGroupMember[];
  /** Active values from Rock defined type 289, Group Member Inactive Reason */
  inactiveReasons: { guid: string; value: string }[];
  /** Wall-clock ms for the Rock calls, for Q3 */
  timings: Record<string, number>;
}
