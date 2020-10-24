const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
       },
    password: {
        type:String,
        required: true
      },
    profile: {
        name: {
            type: String,
            default: 'Anonymous'
           },
        picture: String,
        address:{
            type: String,
            default: 'unknown'
        }   
      },
    history: [{
        date: {
            type: Date,
            default: Date.now
            },
        paid:{
            type:Number,
            default: 0
        }    
    }]        
});


UserSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified('password')){
        return next();
    }

    return bcrypt.genSalt(12).then(salt => bcrypt.hash(user.password,salt))
             .then(hash => {
                    user.password = hash;
                    return next();
             }).catch(err => next(err))
})

UserSchema.methods.comparePassword = password => {
    return bcrypt(password,user.password);
}

UserSchema.methods.gravatar = function gravatar(size){
    if(!size){
        this.size = 200;
    } else {
        this.size = size;
    }

    if (!this.email) return `https://gravatar.com/avatar/?s${this.size}&d=retro`;
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s${this.size}&d=retro`;
}

module.exports = mongoose.model('User',UserSchema);