import { Prisma } from "@wibbo/prisma"

export const logStaffDao = {
  getAll: async () => prisma.logStaff.findMany(),
  getOne: async (id: number) => prisma.logStaff.findFirst({ where: { id } }),
  remove: async (id: number) => prisma.logStaff.delete({ where: { id } }),
  removeAll: async (ids: number[]) => prisma.logStaff.deleteMany({ where: { id: { in: ids } } }),
  update: async (id: number, data: Prisma.LogStaffUpdateInput) => prisma.logStaff.update({ where: { id }, data }),
  create: async (data: Prisma.LogStaffCreateInput) => prisma.logStaff.create({ data })
}
