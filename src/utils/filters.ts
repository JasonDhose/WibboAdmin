export const formatDateComplet = (value: number) => {
    const date = new Date(value * 1000)

    const day = (date.getDate() < 10 ? '0' : '') + date.getDate()
    const month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)
    const year = date.getFullYear()

    const hour = (date.getHours() < 10 ? '0' : '') + date.getHours()
    const minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()

    return `${day}/${month}/${year} à ${hour}:${minute}`
}
