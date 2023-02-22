import { useState, useRef, useEffect } from "react";
import { CloudinaryContext, Image } from "cloudinary-react";
import {
  fetchPhotos,
  openUploadWidget,
  calcPolygonArea
} from "../utils/CloudinaryService";
import Button from "@material-ui/core/Button";

export default function IndexPage() {
  const [images, setImages] = useState([]);
  const pageTag = "demo1";
  function loadScript(src, position, id) {
    if (!position) {
      return;
    }
    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("id", id);
    script.src = src;
    position.appendChild(script);
  }

  const beginUpload = tag => {
    const uploadOptions = {
      cloudName: "opusaffair",
      tags: [tag],
      uploadPreset: "jhtlnckh",
      sources: ["local", "image_search", "url"],
      googleApiKey: process.env.GOOGLE_API_KEY,
      searchBySites: ["all", "opusaffair.com"],
      searchByRights: true,
      cropping: true,
      // showSkipCropButton: true,
      // croppingAspectRatio: null,
      multiple: false,
      minImageHeight: null,
      minImageWidth: null,
      // croppingValidateDimensions: false,
      maxFileSize: 500000,
      styles: {
        palette: {
          window: "#ffffff",
          sourceBg: "#f4f4f5",
          windowBorder: "#90a0b3",
          tabIcon: "#000000",
          inactiveTabIcon: "#555a5f",
          menuIcons: "#555a5f",
          link: "#0433ff",
          action: "#339933",
          inProgress: "#0433ff",
          complete: "#339933",
          error: "#cc0000",
          textDark: "#000000",
          textLight: "#fcfffd"
        },
        fonts: {
          default: null,
          "'Merriweather', serif": {
            url: "https://fonts.googleapis.com/css?family=Merriweather",
            active: true
          }
        }
      },
      text: {
        en: {
          crop: {
            skip_btn: "Continue"
          }
        }
      }
    };

    openUploadWidget(uploadOptions, (error, photos) => {
      if (!error) {
        // console.log(photos);
        if (photos.event === "success") {
          if (photos.info.info.ocr.adv_ocr.data.length > 1) {
            console.log(
              "OCR",
              calcPolygonArea(
                photos.info.info.ocr.adv_ocr.data[0].textAnnotations[0]
                  .boundingPoly.vertices
              ) /
                (photos.info.height * photos.info.width)
            );
          }
          setImages([...images, photos.info.public_id]);
        }
      } else {
        console.log(error);
      }
    });
  };

  const loaded = useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#cloudinary")) {
      loadScript(
        "https://widget.cloudinary.com/v2.0/global/all.js",
        document.querySelector("head"),
        "cloudinary"
      );
    }

    loaded.current = true;
  }

  useEffect(() => {
    fetchPhotos(pageTag, setImages);
  }, []);

  return (
    <CloudinaryContext cloudName="opusaffair">
      <div className="App">
        <section>
          <div>
            <Button variant="contained" onClick={() => beginUpload(pageTag)}>
              Upload Image
            </Button>
          </div>
          <div>
            {images.map(i => (
              <Image
                key={i}
                publicId={i}
                fetch-format="auto"
                quality="auto"
                width="auto"
                height="300"
                crop="fill"
                gravity="auto:faces"
                responsiveUseBreakpoints="true"
              />
            ))}
          </div>
        </section>
      </div>
    </CloudinaryContext>
  );
}
