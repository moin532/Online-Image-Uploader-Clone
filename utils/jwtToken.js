
//craeting token and saving Cookie
const sendToken = (user,statusCode,res)=>{
    const token = user.getJWTToken();

    //options for cookie
    // const options = {
    //     expires: new Date(
    //         Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 *1000
    //     ),
    //     path: '/',
    //     // secure: true, // for HTTPS
    //     httpOnly:true,
    //     sameSite:'none',
    //     maxAge : new Date() * 0.001 + 300
    //     // domain:'http://192.168.101.114:3000',
        
    // };
    res.status(statusCode).cookie('token',token).json({
        success:true,
        user,
        token
    })
  
}

module.exports = sendToken;