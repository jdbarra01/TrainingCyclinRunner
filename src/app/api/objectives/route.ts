import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const athleteId = searchParams.get('athleteId')
  const where = athleteId ? { athleteId } : {}
  const objectives = await prisma.trainingObjective.findMany({ where, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(objectives)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { id, startDate, endDate, ...data } = body
  const objective = await prisma.trainingObjective.create({
    data: { ...data, startDate: new Date(startDate), endDate: new Date(endDate) },
  })
  return NextResponse.json(objective, { status: 201 })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, startDate, endDate, ...data } = body
  const objective = await prisma.trainingObjective.update({
    where: { id },
    data: { ...data, ...(startDate && { startDate: new Date(startDate) }), ...(endDate && { endDate: new Date(endDate) }) },
  })
  return NextResponse.json(objective)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.trainingObjective.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
