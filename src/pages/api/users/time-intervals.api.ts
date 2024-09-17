import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '@/pages/api/auth/[...nextauth].api'
import z from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number({}),
      startTimeMinutes: z.number({}),
      endTimeMinutes: z.number({}),
    }),
  ),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') return res.status(405).end()

  const session = await getServerSession(req, res, authOptions(req, res))

  if (!session) return res.status(401).end()

  const { intervals } = timeIntervalsBodySchema.parse(req.body)

  await Promise.all(
    // eslint-disable-next-line array-callback-return
    intervals.map((interval) => {
      return prisma.userTimeIntervals.create({
        data: {
          week_day: interval.weekDay,
          time_end_in_minutes: interval.endTimeMinutes,
          time_start_in_minutes: interval.startTimeMinutes,
          user_id: session.user?.id,
        },
      })
    }),
  )

  return res.status(201).end()
}
