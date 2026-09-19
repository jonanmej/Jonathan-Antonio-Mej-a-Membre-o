import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed.", { cause: error });
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed.", { cause: error });
  }
}

export async function createUser(data: { email: string, displayName: string, role: string, password?: string }) {
  try {
    const result = await db.insert(users).values({
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      password: data.password
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to create user", error);
    throw new Error("Failed to create user.", { cause: error });
  }
}

export async function updateUserRole(id: number, role: string) {
  try {
    const result = await db.update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update user role", error);
    throw new Error("Failed to update user role.", { cause: error });
  }
}
