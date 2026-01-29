const BookModel = require("../Model/Book.model");
const fs = require("fs");
const path = require("path")
const { successResponse, errorResponse } = require("../Utils/response.utils");

const cleanImageUrl = (base, imagePath) =>
    base.replace(/\/$/, "") + "/" + imagePath.replace(/^\//, "");

const getAllBooks = async(req, res) =>{
    const book = await BookModel.find({}).populate('kategori_id').sort({createdAt: -1});
    if(!book) return errorResponse(res, "No Books found plis retry")
    const base = `${req.protocol}://${req.get('host')}`;
    try {
        const bookWithImageUrl = book.map((b) => ({
        _id: b._id,
        judul:b.judul,
        pengarang: b.pengarang,
        bahasa: b.bahasa,
        penerbit: b.penerbit,
        tahun_terbit: b.tahun_terbit,
        halaman: b.halaman,
        stok: b.stok,
        kategori_id: b.kategori_id,
        gambar: b.gambar ? cleanImageUrl(base, b.gambar) : null,
    }))

    return successResponse(res, "Successfully to get all books", bookWithImageUrl)
    } catch (error) {
        return errorResponse(res, "somethin went wrong", {message: error.message})
    }

}

const getBookById = async(req, res) =>{
    try {
        const {id} = req.params;
        const book = await BookModel.findById({_id:id}).populate('kategori_id');
        if(!book) return errorResponse(res, "this Book is not found,plis retry")
        const base = `${req.protocol}://${req.get('host')}`;
        
        const BookWithIdAndImageUrl = {
            _id: book._id,
            judul:book.judul,
            pengarang: book.pengarang,
            bahasa: book.bahasa,
            penerbit: book.penerbit,
            tahun_terbit: book.tahun_terbit,
            halaman: book.halaman,
            stok: book.stok,
            kategori_id: book.kategori_id,
            gambar: book.gambar ? cleanImageUrl(base, book.gambar) : null,
        }
        return successResponse(res, "Successfully to get book by id",BookWithIdAndImageUrl)
    } catch (error) {
        return errorResponse(res, "somethin went wrong", {message: error.message})
    }
}


const getBookByCategory = async(req, res) =>{
    try {
        const {id} = req.params;
        const book = await BookModel.find({kategori_id:id}).populate('kategori');
        const base = `${req.protocol}://${req.get('host')}`;
        
        const BookWithIdAndImageUrl = book.map((b) => ({
            _id: b._id,
            judul:b.judul,
            pengarang: b.pengarang,
            bahasa: b.bahasa,
            penerbit: b.penerbit,
            tahun_terbit: b.tahun_terbit,
            halaman: b.halaman,
            stok: b.stok,
            kategori_id: b.kategori_id,
            gambar: b.gambar ? cleanImageUrl(base, b.gambar) : null,
        }))
        return successResponse(res, "Successfully to get book by category",BookWithIdAndImageUrl)
    } catch (error) {
        return errorResponse(res, "somethin went wrong", {message: error.message})
    }
}

const createBook = async(req, res) =>{
    try {
        const { judul, pengarang, bahasa, penerbit, tahun_terbit, halaman, stok, kategori_id } = req.body;
        const gambar = req.file ? `/Uploads/${req.file.filename}` : null;
        const Book = await BookModel.create({
            judul,
            pengarang,
            bahasa,
            penerbit,
            tahun_terbit,
            halaman: parseInt(halaman),
            stok: parseInt(stok),
            kategori_id,
            gambar
        })

        const base = `${req.protocol}://${req.get('host')}`;
        return successResponse(res, "Successfully to create book", {
            ...Book,
            gambar: Book.gambar ? `${base}${Book.gambar}` : null,
        })
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })
    }
}

const updateBook = async(req, res) =>{
    try {
        const {id} = req.params;
        const { judul, pengarang, bahasa, penerbit, tahun_terbit, halaman, stok, kategori_id } = req.body;
        const gambar = req.file ? `Uploads/${req.file.filename}` : null;

        const book = await BookModel.findById({_id:id});
        if(!book) return errorResponse(res, "this book is not found, plis retry")
        
        if(gambar && book.gambar){
            const oldImagePath = path.join(
                process.cwd(),
                "Uploads",
                path.basename(book.gambar)
            )

            fs.unlink(oldImagePath,(err) =>{
                err ? console.warn("gagal menghapus gambar lama:", err) : console.log("file lama terhapus", oldImagePath)
            })
        }

        const updateBook = {
            judul,
            pengarang,
            bahasa,
            penerbit,
            tahun_terbit,
            halaman: parseInt(halaman),
            stok: parseInt(stok),
            kategori_id,
        }
        if(gambar) updateBook.gambar = gambar;

        const UpdatedBook = await BookModel.findByIdAndUpdate({
            _id:id
        },
        updateBook
    )
        const base = `${req.protocol}://${req.get('host')}`;
        return successResponse(res, "Successfully to update book", {
            ...UpdatedBook,
            gambar: UpdatedBook.gambar ? cleanImageUrl(base, UpdatedBook.gambar) : null,
        })
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })
    }
}


const DeleteBook = async(req, res) =>{
    try {
        const {id} = req.params;
        const gambar = req.file ? `Uploads/${req.file.filename}` : null;

        const book = await BookModel.findById({_id:id});
        if(!book) return errorResponse(res, "this book is not found, plis retry")
        
        if(book.gambar){
            const oldImagePath = path.join(
                process.cwd(),
                "Uploads",
                path.basename(book.gambar)
            )

            fs.unlink(oldImagePath,(err) =>{
                err ? console.warn("gagal menghapus gambar lama:", err) : console.log("file lama terhapus", oldImagePath)
            })
        }

        const UpdatedBook = await BookModel.findByIdAndDelete({
            _id:id
        },
    )
        return successResponse(res, "Successfully to update book")
    } catch (error) {
        return errorResponse(res, "something wrong", { message: error.message })
    }
}

module.exports = { getAllBooks, getBookById, getBookByCategory, createBook, updateBook, DeleteBook}