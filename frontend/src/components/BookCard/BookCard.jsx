import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ data, favourite, onRemoveFromUI }) => {
  return (
    <>
      <Link to={`/view-book-details/${data._id}`}>
        <div className="bg-zinc-800 rounded p-4 flex-col">
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img
              src={data.url}
              alt={data.title}
              className="h-[25vh] w-full object-cover"
            />
          </div>
          <div>
            <h2 className="mt-2 text-xl font-semibold">{data.title}</h2>
            <p className="mt-2 text-zinc-400 font-semibold">{data.author}</p>
            <p className="mt-2 text-zinc-200 font-semibold text-xl">₹{data.price}</p>
          </div>
        </div>
      </Link>

      
    </>
  );
};

export default BookCard;
