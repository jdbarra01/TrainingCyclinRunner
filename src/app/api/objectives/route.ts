import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const athleteId = searchParams.get('athleteId')
    const where = athleteId ? { athleteId } : {}
    const objectives = await prisma.trainingObjective.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(objectives)
  } catch (error) {
    console.error('GET /api/objectives error:', error)
    return NextResponse.json({ error: 'Error al obtener objetivos', details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { startDate, endDate, ...data } = body
    const objective = await prisma.trainingObjective.create({
      data: { ...data, startDate: new Date(startDate), endDate: new Date(endDate) },
    })
    return NextResponse.json(objective, { status: 201 })
  } catch (error) {
    console.error('POST /api/objectives error:', error)
    return NextResponse.json({ error: 'Error al crear objetivo', details: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, startDate, endDate, ...data } = body
    const objective = await prisma.trainingObjective.update({
      where: { id },
      data: { ...data, ...(startDate && { startDate: new Date(startDate) }), ...(endDate && { endDate: new Date(endDate) }) },
    })
    return NextResponse.json(objective)
  } catch (error) {
    console.error('PUT /api/objectives error:', error)
    return NextResponse.json({ error: 'Error al actualizar objetivo', details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.trainingObjective.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/objectives error:', error)
    return NextResponse.json({ error: 'Error al eliminar objetivo', details: String(error) }, { status: 500 })
  }
}
