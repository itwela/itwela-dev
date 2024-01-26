import React from 'react';

// Define your functional component
const Contact = () => {
  return (
    <section className='main-section w-[100vw] h-[100vh] grid place-content-center'>
        <div className="extra-space w-[61.8vw]">
            <h1>Contact</h1>
            <br />
            <h2><strong>Email:</strong> <a href="mailto:iibomu@wgu.edu">iibomu@wgu.edu</a></h2> 
            <h2><strong>Linkedin:</strong> <a href="linkedin.com/in/itwela/">linkedin.com/in/itwela/</a></h2>
        </div>
    </section>
  );
};

// Export the component
export default Contact;