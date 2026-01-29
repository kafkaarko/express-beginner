const successResponse = (res, message, data=null, status=200) =>{
    return res.status(status).json({
        succes:true,
        message,
        data
    })
}

const errorResponse = (res, message, data=null, status=400) =>{
    return res.status(status).json({
        succes:true,
        message,
        data
    })
}

module.exports = { successResponse, errorResponse}