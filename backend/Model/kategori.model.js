const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const KategoriSchema = new Schema({
    nama_kategori:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('kategori', KategoriSchema);