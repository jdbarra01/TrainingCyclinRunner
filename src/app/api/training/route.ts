import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const athleteId = searchParams.get('athleteId')
    const where = athleteId ? { athleteId } : {}
    const plans = await prisma.trainingPlan.findMany({ where, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(plans)
  } catch (error) {
    console.error('GET /api/training error:', error)
    return NextResponse.json({ error: 'Error al obtener planes', details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, startDate, endDate, ...data } = body
    const plan = await prisma.trainingPlan.create({
      data: { ...data, startDate: new Date(startDate), endDate: new Date(endDate) },
    })
    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('POST /api/training error:', error)
    return NextResponse.json({ error: 'Error al crear plan', details: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, startDate, endDate, ...data } = body
    const plan = await prisma.trainingPlan.update({
      where: { id },
      data: { ...data, ...(startDate && { startDate: new Date(startDate) }), ...(endDate && { endDate: new Date(endDate) }) },
    })
    return NextResponse.json(plan)
  } catch (error) {
    console.error('PUT /api/training error:', error)
    return NextResponse.json({ error: 'Error al actualizar plan', details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.trainingPlan.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/training error:', error)
    return NextResponse.json({ error: 'Error al eliminar plan', details: String(error) }, { status: 500 })
  }
}
