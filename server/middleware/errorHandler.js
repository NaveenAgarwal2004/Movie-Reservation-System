const errorHandler = (err, req, res, next)=>{
    console.error('Error : ',err);

    //Mongoose Validation Error
    if(err.name === 'ValidationError'){
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            message: 'Validation Error',
            errors: errors
        })
    }

    //Mongoose Duplicate Key Error
    if(err.code === 11000){
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            message: `${field} already exists`
        })
    }

    //JWT Error
    if(err.name === 'JsonWebTokenError'){
        return res.status(401).json({
            message: 'Invalid token'
        });
    }

    if(err.name === 'TokenExpiredError'){
        return res.status(401).json({
            message: 'Token has expired'
        })
    }

    //Default Error

    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error'
    })
}
module.exports = errorHandler;