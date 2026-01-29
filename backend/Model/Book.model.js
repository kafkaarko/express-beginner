const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    judul:{
        type:String,
        required:true
    },
    pengarang:{
        type:String,
        required:true
    },
    bahasa:{
        type:String,
        required:true
    },
    penerbit:{
        type:String,
        required:true
    },
    tahun_terbit:{
        type:String,
        required:true
    },
    halaman:{
        type:Number,
        required:true
    },
    stok:{
        type:Number,
        required:true
    },
    kategori_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"kategori",
        required:true
    },
    gambar:{
        type:String
    }
}, {timestamps:true})

module.exports = mongoose.model('book', BookSchema);