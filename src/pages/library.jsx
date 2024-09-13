

import React from 'react';

const Library = () => {
  const books = [
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      image: '/placeholder.svg',
      status: 'In Stock',
      buttonLabel: 'Borrow'
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      image: '/placeholder.svg',
      status: 'In Stock',
      buttonLabel: 'Borrow'
    },
    {
      title: '1984',
      author: 'George Orwell',
      image: '/placeholder.svg',
      status: 'In Stock',
      buttonLabel: 'Borrow'
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      image: '/placeholder.svg',
      status: 'In Stock',
      buttonLabel: 'Borrow'
    },
  ];

  const borrowedBooks = [
    {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      image: '/placeholder.svg',
      status: 'Overdue',
      statusClass: 'text-red-500',
      buttonLabel: 'Return'
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      image: '/placeholder.svg',
      status: 'Due in 3 days',
      statusClass: 'text-green-500',
      buttonLabel: 'Return'
    },
    {
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      image: '/placeholder.svg',
      status: 'Due in 7 days',
      statusClass: 'text-green-500',
      buttonLabel: 'Return'
    },
    {
      title: 'The Shining',
      author: 'Stephen King',
      image: '/placeholder.svg',
      status: '',
      statusClass: '',
      buttonLabel: 'Return'
    },
  ];

  const renderBooks = (books) =>
    books.map((book, index) => (
      <div
        key={index}
        className="border bg-card text-card-foreground shadow-sm rounded-lg overflow-hidden"
        data-v0-t="card"
      >
        <div className="p-4">
          <img
            src={book.image}
            alt="Book Cover"
            width="200"
            height="300"
            className="w-full h-48 object-cover rounded-lg"
            style={{ aspectRatio: '200 / 300', objectFit: 'cover' }}
          />
          <div className="mt-4">
            <h3 className="text-lg font-bold">{book.title}</h3>
            <p className="text-muted-foreground text-sm">{book.author}</p>
          </div>
        </div>
        <div className="p-6 bg-card-foreground/10 px-4 py-2 flex items-center justify-between">
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
            {book.buttonLabel}
          </button>
          <div className={`text-muted-foreground text-sm ${book.statusClass}`}>{book.status}</div>
        </div>
      </div>
    ));

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-4">Available Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderBooks(books)}
        </div>
      </div>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-4">Borrowed Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderBooks(borrowedBooks)}
        </div>
      </div>
    </main>
  );
};

export default Library;
