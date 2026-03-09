import { REST_RESOURCE } from '@my-monorepo/types';
import { RequestMethod } from '@nestjs/common';

export const PUBLIC_ROUTES = [
  {
    path: `${REST_RESOURCE.AUTH}/${REST_RESOURCE.SIGNUP}`,
    method: RequestMethod.POST,
  },
  {
    path: `${REST_RESOURCE.AUTH}/${REST_RESOURCE.SIGNIN}`,
    method: RequestMethod.POST,
  },
  {
    path: REST_RESOURCE.HEALTH,
    method: RequestMethod.GET,
  },
];
