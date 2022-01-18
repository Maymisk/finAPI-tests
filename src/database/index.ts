import { createConnection, getConnectionOptions } from 'typeorm';

export default async (host="fin_api") => {
    const defaultOptions = await getConnectionOptions()

    return await createConnection(
        Object.assign(defaultOptions, {
            host: process.env.NODE_ENV === 'test' ? 'localhost' : host
        })
    )}
