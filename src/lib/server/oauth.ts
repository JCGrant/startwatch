import { env } from '$env/dynamic/private';
import { Discord } from 'arctic';

export const discord = new Discord(
  env.DISCORD_CLIENT_ID,
  env.DISCORD_CLIENT_SECRET,
  env.DISCORD_REDIRECT_URI,
);
