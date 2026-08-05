/**
 * THROWAWAY SPIKE CODE — lightly styled for readability.
 *
 * The point is to exercise the auth gate and the write paths against real Rock
 * and read the raw results back, not to provide production UI. Do not extract
 * components from this.
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

const STATUS_STYLE: Record<number, string> = {
  0: 'bg-gray-100 text-gray-700',
  1: 'bg-green-100 text-green-800',
  2: 'bg-amber-100 text-amber-800',
};

export default function SpikeManageMembers() {
  const { groupId, leadership, members, inactiveReasons, timings } =
    useLoaderData<SpikeLoaderData>();
  const actionData = useActionData();
  const navigation = useNavigation();
  const busy = navigation.state !== 'idle';

  return (
    <main className='mx-auto max-w-7xl space-y-8 px-4 py-24 text-gray-900 sm:px-6'>
      <header className='space-y-3'>
        <p className='text-sm font-semibold uppercase tracking-wide text-blue-700'>
          Development spike
        </p>
        <h1 className='text-3xl font-bold'>Manage group members</h1>
        <p className='text-lg text-gray-600'>
          Viewing group <span className='font-semibold'>{groupId}</span>
        </p>
      </header>

      <section className='rounded-lg border border-green-200 bg-green-50 p-5'>
        <h2 className='text-lg font-semibold text-green-900'>
          You can manage this group
        </h2>
        <p className='mt-1 text-sm text-green-800'>
          You are signed in as an active group leader. Your member ID is{' '}
          <strong>{leadership.groupMemberId}</strong> and your role ID is{' '}
          <strong>{leadership.groupRoleId}</strong>.
        </p>
        <details className='mt-3 text-sm text-green-900'>
          <summary className='cursor-pointer font-medium'>
            Show loader timings
          </summary>
          <pre className='mt-2 overflow-x-auto rounded bg-white/70 p-3'>
            {JSON.stringify(timings, null, 2)}
          </pre>
        </details>
      </section>

      <section className='space-y-3'>
        <div>
          <h2 className='text-2xl font-semibold'>
            Current members ({members.length})
          </h2>
          <p className='mt-1 text-sm text-gray-600'>
            Choose an inactive reason and remove a member, or use the form below
            to add an existing person.
          </p>
        </div>

        <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm'>
          <table className='min-w-full divide-y divide-gray-200 text-left text-sm'>
            <thead className='bg-gray-50 text-xs uppercase tracking-wide text-gray-600'>
              <tr>
                <th className='px-4 py-3'>Member</th>
                <th className='px-4 py-3'>Role</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3'>Identifiers</th>
                <th className='px-4 py-3'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {members.map((member) => (
                <tr key={member.groupMemberId} className='align-top'>
                  <td className='px-4 py-4'>
                    <div className='font-semibold'>{member.name}</div>
                    {member.email ? (
                      <div className='mt-1 text-gray-500'>{member.email}</div>
                    ) : null}
                  </td>
                  <td className='px-4 py-4'>
                    <div>{member.roleName}</div>
                    {member.isLeader ? (
                      <span className='mt-1 inline-block text-xs font-semibold text-blue-700'>
                        Group leader
                      </span>
                    ) : null}
                  </td>
                  <td className='px-4 py-4'>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        STATUS_STYLE[member.status] ??
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {STATUS_LABEL[member.status] ??
                        `Unknown (${member.status})`}
                    </span>
                  </td>
                  <td className='px-4 py-4 font-mono text-xs text-gray-600'>
                    <div>Person: {member.personId}</div>
                    <div className='mt-1'>
                      Membership: {member.groupMemberId}
                    </div>
                  </td>
                  <td className='px-4 py-4'>
                    {member.groupMemberId === leadership.groupMemberId ? (
                      <span className='text-sm text-gray-500'>
                        This is you; self-removal is disabled.
                      </span>
                    ) : (
                      <Form
                        method='post'
                        className='flex min-w-64 flex-col gap-2'
                      >
                        <input type='hidden' name='intent' value='remove' />
                        <input
                          type='hidden'
                          name='groupMemberId'
                          value={member.groupMemberId}
                        />
                        <label
                          className='text-xs font-medium text-gray-700'
                          htmlFor={`inactive-reason-${member.groupMemberId}`}
                        >
                          Inactive reason
                        </label>
                        <select
                          id={`inactive-reason-${member.groupMemberId}`}
                          name='inactiveReasonGuid'
                          defaultValue=''
                          className='rounded-md border border-gray-300 bg-white px-3 py-2'
                        >
                          <option value=''>Choose a reason</option>
                          {inactiveReasons.map((reason) => (
                            <option key={reason.guid} value={reason.guid}>
                              {reason.value}
                            </option>
                          ))}
                        </select>
                        <button
                          type='submit'
                          disabled={busy}
                          className='rounded-md bg-red-700 px-3 py-2 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          {busy ? 'Working…' : 'Remove member'}
                        </button>
                      </Form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h2 className='text-2xl font-semibold'>Add an existing person</h2>
        <p className='mt-2 max-w-3xl text-sm text-gray-600'>
          Enter an existing Rock person ID and the role they should have. If
          this person was previously removed with the same role, the action
          reactivates their existing membership instead of creating a duplicate.
        </p>
        <Form
          method='post'
          className='mt-5 grid max-w-2xl gap-4 sm:grid-cols-2'
        >
          <input type='hidden' name='intent' value='add' />
          <label className='space-y-1 text-sm font-medium'>
            <span>Rock person ID</span>
            <input
              name='personId'
              type='number'
              required
              className='block w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </label>
          <label className='space-y-1 text-sm font-medium'>
            <span>Group role ID</span>
            <input
              name='groupRoleId'
              type='number'
              defaultValue={44}
              required
              className='block w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </label>
          <button
            type='submit'
            disabled={busy}
            className='rounded-md bg-blue-700 px-4 py-2.5 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 sm:w-fit'
          >
            {busy ? 'Working…' : 'Add member'}
          </button>
        </Form>
      </section>

      <section className='rounded-lg border border-gray-200 bg-gray-950 p-6 text-gray-100'>
        <h2 className='text-lg font-semibold'>Last action result</h2>
        <p className='mt-1 text-sm text-gray-400'>
          Technical response from the most recent add or remove request.
        </p>
        <pre className='mt-4 overflow-x-auto text-sm'>
          {actionData
            ? JSON.stringify(actionData, null, 2)
            : 'No action submitted yet.'}
        </pre>
      </section>
    </main>
  );
}
