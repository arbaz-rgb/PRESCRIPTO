import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* left section */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Our doctor appointment service helps patients connect with trusted
            healthcare professionals quickly and easily. With just a few clicks,
            you can browse through experienced doctors, view their specialties,
            and schedule appointments online. Designed for convenience and
            reliability, the platform ensures access to quality care, making
            health management simpler and more efficient than ever before
          </p>
        </div>

        {/* center section */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* right section */}
        <div>
          <p className="text-xl font-medium mb-5"> GET IN TOUCH</p>
          <ul className="flex flex-col text-gray-600">
            <li>+91-9691789827</li>
            <li>ak2208803@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* copyright text */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright © 2024 GreatStack - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
