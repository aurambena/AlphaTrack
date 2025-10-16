import winston from 'winston';

const logger = winston.createLogger({
    //login level, can be info
    level: 'error',
    //format that we want to use
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
    ),
//how can we this will be save, third party can be use
transports: [
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'info.log', level: 'info'}),
]
})

export default logger;