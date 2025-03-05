import { Link } from "react-router";
import arrowIcon from "../assets/icons/arrow_forward_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg";
import Footer from "../components/Footer";
const WelcomePage = () => {
  const images = import.meta.glob("../assets/images/welcomepage/*.jpg", {
    eager: true,
  });
  const imageArray = Object.values(images).map((module) => module.default);

  const StyleText = "font-jakarta font-extrabold text-recipe-third";

  function getRandomWord() {
    const words = [
      "Consume",
      "Devour",
      "Munch",
      "Nibble",
      "Chew",
      "Ingest",
      "Feast",
      "Snack",
      "Dine",
      "Gobble",
      "Swallow",
      "Partake",
      "Indulge",
    ];
    return words[Math.floor(Math.random() * words.length)];
  }
  const randomWords = imageArray.map(() => getRandomWord());
  const logintemp = () => {
    return (
      <Link to="/login">
        <button className={`${StyleText} md:mb-[10px]`}>
          <span className="flex border-b-3 border-recipe-third mb-[-1px]">
            <img
              src={arrowIcon}
              alt="Arrow Icon"
              className="w-[20px] md:w-[15px] 2xl:w-[20px]"
            />
            <span className="text-[24px] md:text-[10px] 2xl:text-[20px]">
              LOGIN
            </span>
          </span>
        </button>
      </Link>
    );
  };
  return (
    <>
      <header className=" ml-[2.375rem] mt-[1rem] mb-[3.75rem]">
        <div className="hidden md:block">{logintemp()}</div>

        <div className="md:flex justify-between">
          <h1
            className={`${StyleText} text-[35px] md:text-[50px] lg:text-[60px] 2xl:text-[80px] text-sm/[110%] mb-[1rem]`}
          >
            Hi,we are <span className="text-recipe-primary">Calibrium</span>,
            <br />
            Macro tracker. <br />
            Cook book.
          </h1>

          <p
            className={`${StyleText} md:text-[20px] lg:text-[24px] 2xl:text-[50px] hidden md:block text-sm/[100%]`}
          >
            We specialize in helping you achieve{" "}
            <br className="hidden md:block" /> your health goals through
            personalized <br className="hidden md:block" /> calorie tracking and
            tailored recipe suggestions. <br className="hidden md:block" />
            With our slogan 'For those who want to change,'
            <br className="hidden md:block" /> we make it easy to enjoy
            nutritious meals and stay <br className="hidden md:block" /> on
            track with your fitness journey.
          </p>
        </div>

        <div className="md:hidden">{logintemp()}</div>
      </header>
      <main>
        <div className="columns-2 md:columns-3 lg:columns-4 2xl:columns-5 gap-1.25">
          {imageArray.map((src, index) => (
            <Link to="/login" key={index}>
              <div className="break-inside-avoid mb-1.25 group relative overflow-hidden bg-recipe-third">
                <img
                  src={src}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover transition duration-400 ease-in-out group-hover:scale-110 group-hover:opacity-50"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-recipe-fifth text-[30px] font-jakarta font-extrabold opacity-0 group-hover:opacity-100">
                  {randomWords[index]}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer></Footer>
    </>
  );
};

export default WelcomePage;
