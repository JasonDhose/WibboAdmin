export default defineEventHandler(async (event) => {
    const sessionUser = getSessionUser(event);

    if (sessionUser.rank < 6) {
        throw createError({ statusCode: 403, message: 'Permission requise' });
    }

    const startTime = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
    const statsNow = await emulatorStatsDao.getAllByTime(startTime)

    const firstTime = Math.floor(Date.now() / 1000) - 8 * 24 * 60 * 60;
    const lastTime = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
    const statsLastWeek = await emulatorStatsDao.getAllByTime(firstTime, lastTime)

    return {
        now: statsNow,
        lastweek: statsLastWeek,
    };
});
