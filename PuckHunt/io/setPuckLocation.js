// @flow
import {BASE_URL} from '../constants/api';

type InputType = {|
  id: number,
  lat: number,
  lng: number,
|};

export default async (input: InputType): Promise<void> => {
  const {id, lat, lng} = input;

  const rsp = await fetch(`${BASE_URL}/set_puck_location`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      lat,
      lng,
    }),
  });
  if (!rsp.ok) {
    const body = await rsp.text();
    throw new Error(body);
  }
};