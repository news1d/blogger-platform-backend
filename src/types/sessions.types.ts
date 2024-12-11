export type SessionDBType = {
    userId: string;
    deviceId: string;
    iat: Date;
    deviceName: string;
    ip: string;
    exp: Date;
}

export type SessionViewModel = {
    ip: string;
    title: string;
    lastActiveDate: Date;
    deviceId: string;
}