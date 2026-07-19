import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(workouts)
  } catch (error) {
    console.error('GET /api/workouts error:', error)
    return NextResponse.json({ error: 'Error al obtener workouts', details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, scheduledDate, ...data } = body
    const workout = await prisma.workout.create({
      data: { ...data, ...(scheduledDate && { scheduledDate: new Date(scheduledDate) }) },
    })
    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    console.error('POST /api/workouts error:', error)
    return NextResponse.json({ error: 'Error al crear workout', details: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, scheduledDate, ...data } = body
    const workout = await prisma.workout.update({
      where: { id },
      data: { ...data, ...(scheduledDate && { scheduledDate: new Date(scheduledDate) }) },
    })
    return NextResponse.json(workout)
  } catch (error) {
    console.error('PUT /api/workouts error:', error)
    return NextResponse.json({ error: 'Error al actualizar workout', details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.workout.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/workouts error:', error)
    return NextResponse.json({ error: 'Error al eliminar workout', details: String(error) }, { status: 500 })
  }
}
