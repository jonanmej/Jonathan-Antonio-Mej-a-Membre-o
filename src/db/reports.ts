import { db } from './index.ts';
import { reports } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getReports() {
  try {
    return await db.select().from(reports);
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed.", { cause: error });
  }
}

export async function upsertReport(data: {
  id: string;
  userId: number;
  date: Date;
  categoryName: string;
  serviceName: string;
  clientName?: string;
  data: any;
}) {
  try {
    const result = await db.insert(reports).values({
      id: data.id,
      userId: data.userId,
      date: data.date,
      categoryName: data.categoryName,
      serviceName: data.serviceName,
      clientName: data.clientName,
      data: data.data,
    }).onConflictDoUpdate({
      target: reports.id,
      set: {
        date: data.date,
        data: data.data,
      }
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to upsert report", error);
    throw new Error("Failed to upsert report.", { cause: error });
  }
}
