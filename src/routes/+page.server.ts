import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions } from './$types';
import { desc, eq } from 'drizzle-orm';

export const load = async (event) => {
  // Load the startwatches for the logged-in user
  const startwatches = await db
    .select()
    .from(table.startwatch)
    .where(eq(table.startwatch.userId, event.locals.user.id))
    .orderBy(desc(table.startwatch.startedAt));

  return {
    startwatches,
  };
};

export const actions = {
  addStartwatch: async (event) => {
    // Parse the form data
    const formData = await event.request.formData();
    const startwatchName = formData.get('name');
    if (typeof startwatchName !== 'string') {
      throw new Error('Invalid startwatch name');
    }
    // Insert the new startwatch
    await db.insert(table.startwatch).values({
      userId: event.locals.user.id,
      name: startwatchName,
      startedAt: new Date(),
    });
  },

  deleteStartwatch: async (event) => {
    // Parse the form data
    const formData = await event.request.formData();
    const startwatchIdString = formData.get('id');
    if (typeof startwatchIdString !== 'string') {
      throw new Error('Invalid startwatch ID');
    }
    const startwatchId = parseInt(startwatchIdString, 10);
    if (isNaN(startwatchId)) {
      throw new Error('Invalid startwatch ID');
    }
    // Delete the startwatch
    await db.delete(table.startwatch).where(eq(table.startwatch.id, startwatchId));
  },
} satisfies Actions;
