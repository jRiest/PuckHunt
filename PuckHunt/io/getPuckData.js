// @flow
import {BASE_URL} from '../constants/api';

import type {PuckDataType} from './types';

export default async (): Promise<Array<PuckDataType>> => {
  const rsp = await fetch(`${BASE_URL}/pucks`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const body = await rsp.json();
  return body.map(item => ({
    id: item.id,
    name: item.name,
    estimoteId: item.estimote_id,
    beaconUuid: item.beacon_uuid,
    beaconMajorVal: item.beacon_major_val,
    beaconMinorVal: item.beacon_minor_val,
    lat: item.lat,
    lng: item.lng,
  }));
};