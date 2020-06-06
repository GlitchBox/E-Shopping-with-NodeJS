const path = require('path');
const User = require('../models/user');

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
        isAuthenticated: request.session.isLoggedIn 
    });
}; 

exports.postLogin = (request, response, next)=>{

    User.findById('5eda492d22d5c264747f355f')
        .then(user=>{

            request.session.user = user;
            request.session.isLoggedIn = true;
            request.session.save((err)=>{

                if(err)
                    console.log(err);
                response.redirect('/');
            });

        })
        .catch(err=>{
            console.log(err);
        })

};

exports.postLogout = (request, response, next)=>{

    // this accepts a callback function
    request.session.destroy((err)=>{

        if(err)
            console.log(err);
        response.redirect('/login');
    })
}