function errorHandler(err, req, res, next) {
    if (err.status === 333) {
        res.status(333)
            .json({ message: 'ErrorHandler: not allowed!' })
    } else {
        console.error(err.stack)
       
        res.status(500)
            .json({ message: 'ErrorHandler: Something went wrong!', err })
    }
}

module.exports = errorHandler;