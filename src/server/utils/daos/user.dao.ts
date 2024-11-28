import { Prisma } from "@wibbo/prisma"

export const userDao = {
  getAll: async () => prisma.user.findMany(),
  getAllLast: async () => prisma.user.findMany({ orderBy: { id: "desc" }, take: 50, select: { id: true, username: true, online: true, ipLast: true, ipcountry: true } }),
  getOne: async (id: number) => prisma.user.findUnique({ where: { id }, select: { id: true, username: true, rank: true, isBanned: true } }),
  getIpLastAndRankByName: async (username: string) => prisma.user.findUnique({ where: { username }, select: { ipLast: true, rank: true } }),
  getOneByName: async (username: string) => prisma.user.findUnique({ where: { username }, select: { id: true, password: true, rank: true } }),
  getAllByIp: async (ip: string) => prisma.user.findMany({ where: { ipLast: ip }, select: { username: true, id: true, online: true, ipcountry: true, rank: true } }),
  update: async (id: number, data: Prisma.UserUpdateInput) => prisma.user.update({ where: { id }, data }),
}
