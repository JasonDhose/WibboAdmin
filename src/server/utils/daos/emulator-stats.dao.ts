import { Prisma } from "@wibbo/prisma"

export const emulatorStatsDao = {
  getAll: async () => prisma.emulatorStats.findMany(),
  getAllByTime: async (firstTime: number, lastTime?: number) => prisma.emulatorStats.findMany({ where: { time: { gt: firstTime, lt: lastTime } }, orderBy: { time: 'asc' } }),
  getOne: async (id: number) => prisma.emulatorStats.findFirst({ where: { id } }),
  remove: async (id: number) => prisma.emulatorStats.delete({ where: { id } }),
  removeAll: async (ids: number[]) => prisma.emulatorStats.deleteMany({ where: { id: { in: ids } } }),
  update: async (id: number, data: Prisma.EmulatorStatsUpdateInput) => prisma.emulatorStats.update({ where: { id }, data }),
  create: async (data: Prisma.EmulatorStatsCreateInput) => prisma.emulatorStats.create({ data })
}
