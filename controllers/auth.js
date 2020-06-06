const path = require('path');

exports.getLogin = (request, response, next)=>{
    
    // console.log(request.get('Cookie'));
    // let isLoggedIn;
    // if(request.get('Cookie')){
    //     sLoggedIn = request.get('Cookie')
    //                     .split('=')[1]
    //                     .trim() === 'true';
    // }
    // console.log(request.session.isLoggedIn);
    response.render(path.join('auth', 'login'), {
        pageTitle:'Login', 
        path: "/login",
        isAuthenticated: false 
    });
}; 

exports.postLogin = (request, response, next)=>{

    request.session.isLoggedIn = true;
    response.redirect('/');
};