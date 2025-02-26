export default function Categories() {
  const test = [
    {
      id: 1,
      name: "Electronics",
      image: "/assets/category1.webp",
    },
    {
      id: 2,
      name: "Fashion",
      image: "/assets/category1.webp",
    },
    {
      id: 3,
      name: "Home & Living",
      image: "/assets/category1.webp",
    },
    {
      id: 3,
      name: "Home & Living",
      image: "/assets/category1.webp",
    },
    {
      id: 3,
      name: "Home & Living",
      image: "/assets/category1.webp",
    },
    {
      id: 3,
      name: "Home & Living",
      image: "/assets/category1.webp",
    },
    {
      id: 3,
      name: "Home & Living",
      image: "/assets/category1.webp",
    },
    {
      id: 3,
      name: "Home & Living",
      image: "/assets/category1.webp",
    },
    {
      id: 3,
      name: "Home & Living",
      image: "/assets/category1.webp",
    },
    {
      id: 3,
      name: "Home & Living",
      image: "/assets/category1.webp",
    },
  ];

  const categories = [...test, ...test];
  return (
    <section className="py-[10px] bg-[#f5f5f5] border-t-[1px] border-[#dedede]">
      <div className="container">
        <h2 className="uppercase pb-[10px] text-[#7a7a7a]">Categories</h2>
        <div className="bg-white overflow-hidden">
          <div className="grid text-[14px] grid-cols-10 mx-[-1px] mb-[-1px]">
            {categories.map((item, index) => (
              <div
                key={index}
                className="border-l-[1px] cursor-pointer hover:bg-[#e8e8e8] border-b-[1px] py-[10px] border-[#e9e9e9] border-t-0"
              >
                <div className="relative pb-[100%]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover absolute top-0 left-0"
                  />
                </div>
                <div className="text-center text-[#7a7a7a]">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
