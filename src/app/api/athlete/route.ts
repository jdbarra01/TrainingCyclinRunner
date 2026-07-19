import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const athletes = await prisma.athlete.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(athletes)
  } catch (error) {
    console.error('GET /api/athlete error:', error)
    return NextResponse.json({ error: 'Error al obtener atletas', details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const athlete = await prisma.athlete.create({ data })
    return NextResponse.json(athlete, { status: 201 })
  } catch (error) {
    console.error('POST /api/athlete error:', error)
    return NextResponse.json({ error: 'Error al crear atleta', details: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const athlete = await prisma.athlete.update({ where: { id }, data })
    return NextResponse.json(athlete)
  } catch (error) {
    console.error('PUT /api/athlete error:', error)
    return NextResponse.json({ error: 'Error al actualizar atleta', details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    await prisma.athlete.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/athlete error:', error)
    return NextResponse.json({ error: 'Error al eliminar atleta', details: String(error) }, { status: 500 })
  }
}
