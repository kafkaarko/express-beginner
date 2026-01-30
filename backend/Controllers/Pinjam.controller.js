const pinjam = require('../Model/Pinjaman.model');
const user = require('../Model/User.Model');
const book = require('../Model/Book.model');
const { errorResponse, successResponse } = require('../Utils/response.utils');
const PinjamanModel = require('../Model/Pinjaman.model');
const mongoose = require('mongoose')

const borrowBook = async (req, res) =>{
    const {userId, bookId, } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
        return errorResponse(res, "Invalid userId or BookId format, please retry");
        }
        const userBorrow = await user.findById({_id:userId});
        const bookBorrow = await book.findById({_id:bookId});

        if(!userBorrow || !bookBorrow) return errorResponse(res, "User or Book not found, please retry");

        if(bookBorrow.stok < 1){
        console.warn(errorResponse(res, "Book is out of stock, please choose another book"));
        }  
        bookBorrow.stok -= 1;
            
        const mulai_minjam = new Date();
        const batas_minjam = new Date();
        batas_minjam.setDate(mulai_minjam.getDate() + 14) //default kembali 14 hari


        const pinjaman = await pinjam.create({
            userId,
            bookId,
            mulai_minjam,
            batas_minjam,
        })

        await bookBorrow.save();

        return successResponse(res, "Successfully to borrow book", pinjaman)
    } catch (error) {
        return errorResponse(res, "something went wrong", {message: error.message})
    }
}

const returnBook = async (req, res) =>{
    const {tanggal_kembali, } = req.body;
    let status;
    const {id} = req.params;

    try {
        const pinjamanRecord = await pinjam.findById({_id:id})
        const bookBorrow = await book.findById({_id:pinjamanRecord.bookId});
        if(!pinjamanRecord) return errorResponse(res, "Pinjaman record not found")

        if(tanggal_kembali > pinjamanRecord.batas_minjam) return status = "terlambat"
        status = "dikembalikan"

        const mulai_minjam = pinjamanRecord.mulai_minjam;
        const batas_minjam = pinjamanRecord.batas_minjam;

        const pinjaman = await pinjam.updateOne({_id: id}, {
            userId: pinjamanRecord.userId,
            bookId: pinjamanRecord.bookId,
            mulai_minjam,
            batas_minjam,
            tanggal_kembali,
            status
        })

        bookBorrow.stok += 1;
        await bookBorrow.save();

        return successResponse(res, `Successfully to return book`)
    } catch (error) {
        return errorResponse(res, "something went wrong", {message: error.message})
    }
}

const getAllBorrowings = async (req, res) =>{
    try {
        const borrow = await pinjam.find({userId: req.user.id}).populate('bookId').sort({createdAt: -1});
        return successResponse(res, "Successfully to get all borrowings", borrow)
    }catch (error) {
        return errorResponse(res, "Something went wrong", {message: error.message})
    }
}

module.exports = {borrowBook, returnBook, getAllBorrowings}