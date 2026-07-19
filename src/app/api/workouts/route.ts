import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const workouts = await prisma.workout.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(workouts)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { id, scheduledDate, ...data } = body
  const workout = await prisma.workout.create({
    data: { ...data, ...(scheduledDate && { scheduledDate: new Date(scheduledDate) }) },
  })
  return NextResponse.json(workout, { status: 201 })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, scheduledDate, ...data } = body
  const workout = await prisma.workout.update({
    where: { id },
    data: { ...data, ...(scheduledDate && { scheduledDate: new Date(scheduledDate) }) },
  })
  return NextResponse.json(workout)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.workout.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
