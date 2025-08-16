const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./UserAuth");
const Book = require("../models/book");


// add book --admin
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to perform this action" });
    }

    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    await book.save();
    res.status(200).json({ message: "Book Added Successfully" });
  } catch (error) {
    console.error("Add book error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// update book --admin
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;

    // Validate user and admin role
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to perform this action" });
    }

    // Update the book
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    res.status(200).json({ message: "Book Updated Successfully" });
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// delete book --admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;

    // Validate user and admin role
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to perform this action" });
    }

    // Delete the book
    await Book.findByIdAndDelete(bookid);

    res.status(200).json({ message: "Book Deleted Successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// get-all-books --for all
router.get("/get-all-books",  async (req, res) => {
  try {
    
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books
    });
  } catch (error) {
    console.error("Get all books error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


//get recentily added books limit 4
router.get("/get-recent-books", async (req, res) =>{
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({
            status: "Success",
            data: books,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json({
      status: "Success",
      data: book,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });


  }

});
// search book by title (name)
router.get("/search-book", async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: "Please provide a book title" });
    }

    // Case-insensitive search
    const books = await Book.find({
      title: { $regex: title, $options: "i" }
    });

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    return res.json({
      status: "Success",
      data: books
    });
  } catch (error) {
    console.error("Search book error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
