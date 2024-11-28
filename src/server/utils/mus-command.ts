export const sendMusCommand = (command: string, data: string = ''): Promise<boolean> => {
    const fullData = `${command}\u0001${data}`;
    const socket = require('net').Socket();

    return new Promise((resolve) => {
        socket.connect(Number(process.env.MUS_PORT), process.env.MUS_IP, () => {
            socket.write(fullData);
            socket.end();
            resolve(true);
        });
        socket.on('error', () => resolve(false));
    });
}
