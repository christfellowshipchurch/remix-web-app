/**
 * THROWAWAY SPIKE CODE — deliberately unstyled.
 *
 * The point is to exercise the auth gate and the write paths against real Rock
 * and read the raw results back, not to look like anything. Do not extract
 * components from this, do not add CSS.
 */
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from 'react-router';
import type { SpikeLoaderData } from './types';

export { loader } from './loader';
export { action } from './action';

const STATUS_LABEL: Record<number, string> = {
  0: 'Inactive',
  1: 'Active',
  2: 'Pending',
};

export default function SpikeManageMembers() {
  const { groupId, leadership, members, inactiveReasons, timings } =
    useLoaderData<SpikeLoaderData>();
  const actionData = useActionData();
  const navigation = useNavigation();
  const busy = navigation.state !== 'idle';

  return (
    <div style={{ padding: 16, fontFamily: 'monospace' }}>
      <h1>SPIKE: manage members — group {groupId}</h1>
      <p>
        Gate passed. Your groupMemberId {leadership.groupMemberId}, roleId{' '}
        {leadership.groupRoleId}.
      </p>
      <p>loader timings (ms): {JSON.stringify(timings)}</p>

      <h2>Members ({members.length})</h2>
      <table border={1} cellPadding={4}>
        <thead>
          <tr>
            <th>memberId</th>
            <th>personId</th>
            <th>name</th>
            <th>role</th>
            <th>isLeader</th>
            <th>status</th>
            <th>remove</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.groupMemberId}>
              <td>{m.groupMemberId}</td>
              <td>{m.personId}</td>
              <td>{m.name}</td>
              <td>{m.roleName}</td>
              <td>{String(m.isLeader)}</td>
              <td>
                {STATUS_LABEL[m.status] ?? m.status} ({m.status})
              </td>
              <td>
                {m.groupMemberId === leadership.groupMemberId ? (
                  <span>(self)</span>
                ) : (
                  <Form method='post'>
                    <input type='hidden' name='intent' value='remove' />
                    <input
                      type='hidden'
                      name='groupMemberId'
                      value={m.groupMemberId}
                    />
                    <select name='inactiveReasonGuid' defaultValue=''>
                      <option value=''>-- reason --</option>
                      {inactiveReasons.map((r) => (
                        <option key={r.guid} value={r.guid}>
                          {r.value}
                        </option>
                      ))}
                    </select>
                    <button type='submit' disabled={busy}>
                      remove
                    </button>
                  </Form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add member (direct POST, by existing personId)</h2>
      <p>
        Legacy creates a brand-new person and fires a workflow instead; this is
        the POST half of the Q2 fork.
      </p>
      <Form method='post'>
        <input type='hidden' name='intent' value='add' />
        <label>
          personId <input name='personId' type='number' required />
        </label>{' '}
        <label>
          groupRoleId{' '}
          <input name='groupRoleId' type='number' defaultValue={44} required />
        </label>{' '}
        <button type='submit' disabled={busy}>
          add
        </button>
      </Form>

      <h2>Last action result</h2>
      <pre>{actionData ? JSON.stringify(actionData, null, 2) : '(none)'}</pre>
    </div>
  );
}
