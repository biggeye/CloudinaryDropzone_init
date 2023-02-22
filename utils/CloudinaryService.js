import { Cloudinary as CoreCloudinary, Util } from "cloudinary-core";

export const url = (publicId, options) => {
  const scOptions = Util.withSnakeCaseKeys(options);
  const cl = CoreCloudinary.new();
  return cl.url(publicId, scOptions);
};

export const openUploadWidget = (options, callback) => {
  const scOptions = Util.withSnakeCaseKeys(options);
  window.cloudinary.openUploadWidget(scOptions, callback);
};

export function calcPolygonArea(vertices) {
  var total = 0;

  for (var i = 0, l = vertices.length; i < l; i++) {
    var addX = vertices[i].x;
    var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
    var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
    var subY = vertices[i].y;

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }

  return Math.abs(total);
}

export async function fetchPhotos(imageTag, setter) {
  const options = {
    cloudName: "opusaffair",
    format: "json",
    type: "list",
    version: Math.ceil(new Date().getTime() / 1000)
  };

  const urlPath = url(imageTag.toString(), options);

  fetch(urlPath)
    .then(res => {
      return res.text();
    })
    .then(text =>
      text
        ? setter(
            JSON.parse(text).resources.map(image => {
              return image.public_id;
            })
          )
        : []
    )
    .catch(err => console.log(err));
}
