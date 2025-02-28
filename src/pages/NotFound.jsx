
import React from 'react';

const NotFound = () => {
   return (
      <div className='w-full h-full min-h-screen bg-slate-200 flex justify-center items-center flex-col p-[20px]'>
         <h1>404 - Page Not Found</h1>
         <p>Sorry, the page you are looking for does not exist.</p>

         {/* home link -- so that navigate to root */}
      </div>
   );
};

export default NotFound;
