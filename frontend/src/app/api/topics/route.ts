import { NextResponse } from 'next/server';
import { SYLLABUS_TOPICS } from '@/lib/syllabusTopics';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const search = searchParams.get('search')?.toLowerCase().trim();

    let list = SYLLABUS_TOPICS;
    if (subject && subject !== 'All') {
      list = list.filter((t) => t.subject.toLowerCase() === subject.toLowerCase());
    }

    if (search) {
      list = list.filter(
        (t) =>
          t.topic.toLowerCase().includes(search) ||
          t.chapter.toLowerCase().includes(search) ||
          t.subject.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      status: 'success',
      total: list.length,
      topics: list
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
