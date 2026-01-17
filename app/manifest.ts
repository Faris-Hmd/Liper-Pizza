import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "لييبر بيتزا",
    short_name: "لييبر",
    description: "أطيب بيتزا في مدينتك - لييبر بيتزا جودة عالية وطعم لا يقاوم",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#800000",
    icons: [
      {
        src: "/brand/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
      // {
      //   src: "/apple-icon",
      //   sizes: "180x180",
      //   type: "image/png",
      // },
    ],
  };
}
