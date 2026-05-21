import ShowLocation from "../components/ShowLocation";


const Contact = () => {

  return (
    <div className="min-h-[100vh] w-full bg-[#121212] py-5 px-4 sm:px-10 text-gray-200 font-bold">
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl text-amber-600">Contact</h1>

      {/* Contact info */}
      <div className="flex flex-col md:flex-row gap-4 mt-5">
        {/* Gmail */}
        <a
          href="https://www.gmail.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 border-gray-500 border-2 px-4 py-3 rounded-lg hover:bg-gray-900 hover:cursor-pointer transition-all duration-300"
        >
          <h6 className="text-xl sm:text-2xl text-amber-500">E-mail</h6>
          <p className="text-base sm:text-lg break-all">
            suprimmaharjan1921@gmail.com
          </p>
        </a>

        {/* Viber/WhatsApp */}
        <a
          href="https://www.whatsapp.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 border-gray-500 border-2 px-4 py-3 rounded-lg hover:bg-gray-900 hover:cursor-pointer transition-all duration-300"
        >
          <h6 className="text-xl sm:text-2xl text-amber-500">Viber/WhatsApp</h6>
          <p className="text-base sm:text-lg">9818279921</p>
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 border-gray-500 border-2 px-4 py-3 rounded-lg hover:bg-gray-900 hover:cursor-pointer transition-all duration-300"
        >
          <h6 className="text-xl sm:text-2xl text-amber-500">Facebook</h6>
          <p className="text-base sm:text-lg">Suprim Maharjan</p>
        </a>
      </div>

      <div className=" h-[300px] md:h-[600px] w-full mt-5 rounded-md overflow-hidden">
        <ShowLocation />
      </div>
    </div>
  );
};

export default Contact;
