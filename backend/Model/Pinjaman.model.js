const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PinjamanSchema = new Schema({ 
    bookId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"book",
        required:true
    }],
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    mulai_minjam:{
        type:Date,
        required:true
    },
    batas_minjam:{
        type:Date,
        required:true
    },
    tanggal_kembali:{
        type:Date,
        default:null
    },
    status:{
        type: String,
        enum:['dipinjam','dikembalikan','terlambat'],
        default:'dipinjam'
    }
}, {timestamps:true})

module.exports = mongoose.model('pinjaman', PinjamanSchema);