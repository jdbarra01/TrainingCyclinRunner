import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const athleteId = searchParams.get('athleteId')
  const where = athleteId ? { athleteId } : {}
  const plans = await prisma.trainingPlan.findMany({ where, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(plans)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { id, startDate, endDate, ...data } = body
  const plan = await prisma.trainingPlan.create({
    data: { ...data, startDate: new Date(startDate), endDate: new Date(endDate) },
  })
  return NextResponse.json(plan, { status: 201 })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, startDate, endDate, ...data } = body
  const plan = await prisma.trainingPlan.update({
    where: { id },
    data: { ...data, ...(startDate && { startDate: new Date(startDate) }), ...(endDate && { endDate: new Date(endDate) }) },
  })
  return NextResponse.json(plan)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.trainingPlan.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
