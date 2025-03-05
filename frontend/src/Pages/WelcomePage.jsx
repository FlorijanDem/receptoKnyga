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
    const handleClick = () => console.log("LOGIN");

    return (
      <button className={`${StyleText} md:mb-[10px]`} onClick={handleClick}>
        <span className="flex border-b-3 border-recipe-third mb-[-1px]">
          <img src={arrowIcon} alt="Arrow Icon" className="md:w-[10px]" />
          <span className="text-[24px] md:text-[10px]">LOGIN</span>
        </span>
      </button>
    );
  };
  return (
    <>
      <header className="md:ml-[2.375rem] mt-[1rem] mb-[3.75rem]">
        <div className="hidden md:block">{logintemp()}</div>

        <div className="md:flex justify-between">
          <h1
            className={`${StyleText} text-[35px] md:text-[50px] lg:text-[60px] text-sm/[110%]`}
          >
            Hi,we are <span className="text-recipe-primary">Calibrium</span>,
            <br />
            Macro tracker. <br />
            Cook book.
          </h1>

          <p
            className={`${StyleText} md:text-[20px] lg:text-[24px] hidden md:block text-sm/[100%]`}
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
        <div className="columns-2 md:columns-3 lg:columns-4 gap-1.25">
          {imageArray.map((src, index) => (
            <div
              key={index}
              className="break-inside-avoid mb-1.25 group relative overflow-hidden bg-recipe-third"
              onClick={() => console.log("LOGIN")}
            >
              <img
                src={src}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover transition duration-400 ease-in-out group-hover:scale-110 group-hover:opacity-50"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-recipe-fifth text-[30px] font-jakarta font-extrabold opacity-0 group-hover:opacity-100">
                {randomWords[index]}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer></Footer>
    </>
  );
};

export default WelcomePage;
