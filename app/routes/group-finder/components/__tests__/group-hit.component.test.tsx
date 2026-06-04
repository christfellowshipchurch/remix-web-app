import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import type { GroupType } from '../../types';
import { GroupHit } from '../group-hit.component';

function createGroupHit(overrides: Partial<GroupType> = {}): GroupType {
  return {
    objectID: 'group-1',
    groupGuid: 'group-guid-1',
    groupId: 1,
    title: 'Test Group',
    summary: 'A test group',
    campusName: 'Palm Beach Gardens',
    coverImage: { sources: [{ uri: '/test-group-image.jpg' }] },
    meetingLocationType: 'Home',
    meetingLocation: 'A home',
    meetingDay: 'Monday',
    meetingTime: '7:00 PM',
    meetingType: 'In Person',
    meetingFrequency: 'Weekly',
    adultsOnly: 'True',
    leaders: null,
    groupFor: 'Anyone',
    language: '',
    topics: 'Bible Study',
    minMaxAge: '18 to 99',
    _geoloc: { lat: 26.839, lng: -80.101 },
    _rankingInfo: { geoDistance: 1609.344 },
    ...overrides,
  };
}

function renderGroupHit(hit: GroupType) {
  return render(
    <MemoryRouter>
      <GroupHit hit={hit} isGeoSearch />
    </MemoryRouter>,
  );
}

describe('GroupHit', () => {
  it('shows location varies when Algolia returns blank geolocation values', () => {
    renderGroupHit(
      createGroupHit({
        _geoloc: { lat: '', lng: '' },
        _rankingInfo: { geoDistance: 5000 * 1609.344 },
      }),
    );

    expect(screen.getByText('Location Varies')).toBeInTheDocument();
    expect(screen.queryByText(/miles away/i)).not.toBeInTheDocument();
  });

  it('shows distance for numeric geolocation values', () => {
    renderGroupHit(createGroupHit());

    expect(screen.getByText('1.0 miles away')).toBeInTheDocument();
  });
});
