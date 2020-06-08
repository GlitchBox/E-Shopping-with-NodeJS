const path = require('path');
const User = require('../models/user');
const crypto = require('bcryptjs');

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

    const email = request.body.email;
    const password = request.body.password;

    User.findOne({email: email})
        .then(user=>{

            if(!user){
                console.log('wrong email!');
                return response.redirect('/login');
            }

            crypto.compare(password, user.password)
                    .then(doesMatch=>{

                        if(doesMatch){
                            request.session.user = user;
                            request.session.isLoggedIn = true;
                            return request.session.save((err)=>{
                
                                if(err)
                                    console.log(err);
                                console.log('Login successful!');
                                response.redirect('/');
                            });              
                        }

                        console.log("Password didn't macth!");
                        response.redirect('/login');

                    })
                    .catch(err=>{
                        console.log(err);
                    })

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

exports.getSignup = (request, response, next)=>{

    response.render(path.join('auth', 'signup'),{
        pageTitle: 'Signup',
        path:'/signup',
        isAuthenticated: request.session.isLoggedIn
    });
};

exports.postSignup = (request, response, next)=>{

    const email = request.body.email;
    const password = request.body.password;
    const confirmPassword = request.body.confirmPassword;

    // console.log(password, confirmPassword);
    if(password.toString() !== confirmPassword.toString()){

        console.log("passwords don't match!");
        return response.redirect('/signup');
    }

    User.findOne({email: email})
        .then(user=>{

            if(user){
                console.log('User exists!');
                return response.redirect('/signup');
            }

             //12 number of rounds will be applied 
            return crypto.hash(password, 12).then(hashPass=>{
                const newUser = new User({

                    email: email,
                    password: hashPass,
                    cart: {items:[]}
                });
    
                newUser.save()        
                    .then(result=>{
                    console.log('User has been created!');
                    response.redirect('/login');
                });
            });
            
        })
        .catch(err=>{
            console.log(err);
        })
};