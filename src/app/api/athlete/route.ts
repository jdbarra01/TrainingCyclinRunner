import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const athletes = await prisma.athlete.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(athletes)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { id, ...data } = body
  const athlete = await prisma.athlete.create({ data })
  return NextResponse.json(athlete, { status: 201 })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...data } = body
  const athlete = await prisma.athlete.update({ where: { id }, data })
  return NextResponse.json(athlete)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  await prisma.athlete.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
