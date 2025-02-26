import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function MainSlider() {
  const swiperRef = useRef(null);

  const items = [
    {
      id: 1,
      title: "Item 1",
      image: "/assets/banner1.png",
    },
    {
      id: 2,
      title: "Item 2",
      image: "/assets/banner1.png",
    },
    {
      id: 3,
      title: "Item 3",
      image: "/assets/banner1.png",
    },
  ];

  return (
    <div className="relative group">
      <Swiper
        className="rounded-[5px] overflow-hidden"
        modules={[Navigation]}
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="pb-[29.93%] relative">
            <Image
              src={item.image}
              alt={item.title}
              width={800}
              height={500}
              className="w-full absolute h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute z-[100] group-hover:opacity-100 opacity-0 w-full top-1/2 flex justify-between transform -translate-y-1/2">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md ml-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="bg-white/80 hover:bg-white p-2 rounded-full shadow-md mr-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
