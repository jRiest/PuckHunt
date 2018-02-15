// @flow
import {BASE_URL} from '../constants/api';

export default async (id: number): Promise<void> => {
  const rsp = await fetch(`${BASE_URL}/clear_puck_location`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    }),
  });
  if (!rsp.ok) {
    const body = await rsp.text();
    throw new Error(`Error saving puck location: ${body}`);
  }
};